import { supabase } from '@/lib/supabase/client';
import jwt from "jsonwebtoken";
import {DecodedToken} from "@/app/api/question/route";

// 유틸: created_at 값을 ISO timestamp로 정규화 (timestamp 중심, 날짜-only도 처리)
const normalizeCreatedAt = (value: any) => {
	// 빈값
	if (!value) return null;

	// 날짜만(YYYY-MM-DD)인 경우는 자정 UTC로 처리
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return new Date(value + 'T00:00:00Z').toISOString();
	}

	// 일반적으로는 Date 파싱을 시도 (timestamp 문자열, 숫자 타임스탬프 등)
	try {
		const parsed = new Date(value);
		if (!isNaN(parsed.getTime())) {
			return parsed.toISOString();
		}
	} catch (e) {
		// ignore
	}
	return null;
};

export const GET = async (req : Request): Promise<Response> => {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new Response(JSON.stringify({ error: 'Access token이 필요합니다.' }), { status: 401 });
		}
		
		const token = authHeader.split(' ')[1];
		
		// ✅ 1️⃣ JWT 토큰 디코딩
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
		} catch (err) {
			console.error('❌ Invalid token:', err);
			return new Response(JSON.stringify({ error: '유효하지 않은 토큰입니다.' }), { status: 401 });
		}
		
		// Supabase에서 created_at 기준 내림차순으로 요청
		const { data, error } = await supabase
			.from('result')
			.select('*')
			.eq("user_uuid", decoded.id)
			.order('created_at', { ascending: false });
		
		if (error) {
			console.error('❌ Supabase error:', error);
			return new Response(
				JSON.stringify({ error: '데이터를 가져오는데 실패했습니다.' }),
				{ status: 500 }
			);
		}
		
		// 추가 안전장치: 받은 데이터를 JS에서 한 번 더 최신순으로 정렬
		let sortedData = (data ?? []).slice();
		try {
			// 각 항목의 created_at을 정규화하여 정렬 키로 사용
			sortedData = (sortedData as any[]).map(item => {
				const normalized = normalizeCreatedAt(item.created_at);
				return {
					...item,
					_created_at_normalized: normalized ?? null,
				};
			}).sort((a, b) => {
				const aTime = a._created_at_normalized ? new Date(a._created_at_normalized).getTime() : 0;
				const bTime = b._created_at_normalized ? new Date(b._created_at_normalized).getTime() : 0;
				return bTime - aTime; // 내림차순(최신순)
			});
		} catch (sortErr) {
			console.warn('정렬 중 경고:', sortErr);
			// 정렬 실패해도 원본 데이터 반환
			sortedData = data ?? [];
		}
		
		// 응답 시: 최신순으로 정렬된 상태에서 created_at을 'YYYY-MM-DD' 형식(day)만 남겨서 반환
		const responseRecords = (sortedData as any[]).map(r => {
			// 정규화된 ISO timestamp 우선 사용, 없으면 원본으로 파싱 시도
			const normalized = r._created_at_normalized ?? normalizeCreatedAt(r.created_at);
			const dateOnly = normalized ? normalized.split('T')[0] :
				(r.created_at ? (() => {
					try { return new Date(r.created_at).toISOString().split('T')[0]; } catch { return null; }
				})() : null);

			// created_at은 날짜(YYYY-MM-DD)로만 표시. 내부 정규화 필드는 제거.
			const out = { ...r, created_at: dateOnly };
			delete out._created_at_normalized;
			return out;
		});

		// ✅ 성공 시 데이터 반환
		return new Response(
			JSON.stringify({
				message: 'success',
				count: responseRecords.length,
				records: responseRecords,
			}),
			{ status: 200 }
		);
	} catch (err) {
		console.error('❌ GET /record error:', err);
		return new Response(
			JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
			{ status: 500 }
		);
	}
};

// 새로 추가: 저장 시 created_at에 시간까지 포함해서 저장하도록 POST 핸들러 추가
export const POST = async (req: Request): Promise<Response> => {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new Response(JSON.stringify({ error: 'Access token이 필요합니다.' }), { status: 401 });
		}
		const token = authHeader.split(' ')[1];
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
		} catch (err) {
			console.error('❌ Invalid token:', err);
			return new Response(JSON.stringify({ error: '유효하지 않은 토큰입니다.' }), { status: 401 });
		}

		const body = await req.json().catch(() => null);
		if (!body) {
			return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), { status: 400 });
		}

		// 저장할 데이터에 명시적으로 ISO timestamp 추가
		const nowIso = new Date().toISOString();
		const insertPayload = {
			// ...body의 다른 필드들 포함
			...body,
			user_uuid: decoded.id,
			created_at: nowIso, // 시간 포함된 값으로 저장
		};

		const { data: insertData, error: insertError } = await supabase
			.from('result')
			.insert([insertPayload]);

		if (insertError) {
			console.error('❌ Supabase insert error:', insertError);
			return new Response(JSON.stringify({ error: '데이터 저장에 실패했습니다.' }), { status: 500 });
		}

		// 성공 응답: 저장된 레코드(시간 포함)
		return new Response(JSON.stringify({ message: 'saved', record: insertData?.[0] ?? null }), { status: 201 });
	} catch (err) {
		console.error('❌ POST /record error:', err);
		return new Response(JSON.stringify({ error: '서버 오류' }), { status: 500 });
	}
};
