import { supabase } from '@/lib/supabase/client';
import jwt from "jsonwebtoken";

export const GET = async (req : Request): Promise<Response> => {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new Response(JSON.stringify({ error: 'Access token이 필요합니다.' }), { status: 401 });
		}
		
		const token = authHeader.split(' ')[1];
		
		// ✅ 1️⃣ JWT 토큰 디코딩
		let decoded: any;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET!);
		} catch (err) {
			console.error('❌ Invalid token:', err);
			return new Response(JSON.stringify({ error: '유효하지 않은 토큰입니다.' }), { status: 401 });
		}
		
		console.log("decoded : ", decoded);
		
		// ✅ record 테이블에서 모든 데이터 조회
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
		
		// ✅ 성공 시 데이터 반환
		return new Response(
			JSON.stringify({
				message: 'success',
				count: data?.length || 0,
				records: data,
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