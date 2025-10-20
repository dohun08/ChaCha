import { supabase } from '@/lib/supabase/client';
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/app/api/question/route";

// ✅ result 테이블 구조 타입 정의
interface ResultRecord {
	id?: number;
	user_uuid: string;
	created_at: string | null;
	[key: string]: unknown; // 나머지 동적 필드
}

// ✅ 정규화된 내부 정렬용 타입
interface NormalizedResultRecord extends ResultRecord {
	_created_at_normalized?: string | null;
}

// ✅ created_at 정규화 유틸
const normalizeCreatedAt = (value: unknown): string | null => {
	if (!value) return null;
	
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return new Date(value + 'T00:00:00Z').toISOString();
	}
	
	if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
		const parsed = new Date(value);
		if (!isNaN(parsed.getTime())) {
			return parsed.toISOString();
		}
	}
	
	return null;
};

export const GET = async (req: Request): Promise<Response> => {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return new Response(JSON.stringify({ error: 'Access token이 필요합니다.' }), { status: 401 });
		}
		
		const token = authHeader.split(' ')[1];
		let decoded: DecodedToken;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
		} catch (err) {
			console.error('❌ Invalid token:', err);
			return new Response(JSON.stringify({ error: '유효하지 않은 토큰입니다.' }), { status: 401 });
		}
		
		// ✅ Supabase 요청
		const { data, error } = await supabase
			.from('result')
			.select('*')
			.eq('user_uuid', decoded.id)
			.order('created_at', { ascending: false });
		
		if (error) {
			console.error('❌ Supabase error:', error);
			return new Response(JSON.stringify({ error: '데이터를 가져오는데 실패했습니다.' }), { status: 500 });
		}
		
		// ✅ 타입 보장: Supabase 응답을 ResultRecord[]로 캐스팅
		const records: ResultRecord[] = (data ?? []) as ResultRecord[];
		
		// ✅ created_at 정규화 + 정렬
		const sortedData: NormalizedResultRecord[] = records
			.map((item) => ({
				...item,
				_created_at_normalized: normalizeCreatedAt(item.created_at),
			}))
			.sort((a, b) => {
				const aTime = a._created_at_normalized ? new Date(a._created_at_normalized).getTime() : 0;
				const bTime = b._created_at_normalized ? new Date(b._created_at_normalized).getTime() : 0;
				return bTime - aTime; // 최신순
			});
		
		// ✅ created_at을 'YYYY-MM-DD' 형식으로 변환
		const responseRecords: ResultRecord[] = sortedData.map((r) => {
			const normalized = r._created_at_normalized ?? normalizeCreatedAt(r.created_at);
			const dateOnly = normalized ? normalized.split('T')[0] : null;
			const { _created_at_normalized, ...rest } = r;
			return { ...rest, created_at: dateOnly };
		});
		
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
		return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { status: 500 });
	}
};

// ✅ POST: 명확한 타입 지정
export const POST = async (req: Request): Promise<Response> => {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return new Response(JSON.stringify({ error: 'Access token이 필요합니다.' }), { status: 401 });
		}
		
		const token = authHeader.split(' ')[1];
		let decoded: DecodedToken;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
		} catch (err) {
			console.error('❌ Invalid token:', err);
			return new Response(JSON.stringify({ error: '유효하지 않은 토큰입니다.' }), { status: 401 });
		}
		
		const body = (await req.json().catch(() => null)) as Partial<ResultRecord> | null;
		if (!body) {
			return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), { status: 400 });
		}
		
		const nowIso = new Date().toISOString();
		const insertPayload: ResultRecord = {
			...body,
			user_uuid: decoded.id,
			created_at: nowIso,
		};
		
		const { data: insertData, error: insertError } = await supabase
			.from('result')
			.insert([insertPayload])
			.select();
		
		if (insertError) {
			console.error('❌ Supabase insert error:', insertError);
			return new Response(JSON.stringify({ error: '데이터 저장에 실패했습니다.' }), { status: 500 });
		}
		
		return new Response(
			JSON.stringify({
				message: 'saved',
				record: insertData?.[0] ?? null,
			}),
			{ status: 201 }
		);
	} catch (err) {
		console.error('❌ POST /record error:', err);
		return new Response(JSON.stringify({ error: '서버 오류' }), { status: 500 });
	}
};