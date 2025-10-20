import { supabase } from '@/lib/supabase/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getCarCode } from '@/utils/changeToCar';

type CarType = '🏎️' | '🚘' | '🚓' | '🚒' | '🚛';

// 질문별 점수 매핑 테이블
const scoreMap: Record<number, Record<CarType, number[]>> = {
	1: { '🏎️': [5,4,3,2,1], '🚘': [4,5,4,3,2], '🚓': [1,2,3,4,5], '🚒': [2,3,4,5,3], '🚛': [2,3,4,5,3] },
	2: { '🏎️': [1,2,3,4,5], '🚘': [2,3,4,5,4], '🚓': [5,4,3,2,1], '🚒': [4,5,3,2,1], '🚛': [5,4,3,2,1] },
	3: { '🏎️': [2,3,4,5,3], '🚘': [3,4,5,4,3], '🚓': [3,4,5,4,3], '🚒': [5,4,3,2,1], '🚛': [4,5,3,2,1] },
	4: { '🏎️': [5,4,3,2,1], '🚘': [5,4,3,2,1], '🚓': [2,3,4,5,4], '🚒': [3,4,5,4,3], '🚛': [2,3,4,5,4] },
	5: { '🏎️': [2,3,4,5,4], '🚘': [3,4,5,4,3], '🚓': [5,4,3,2,1], '🚒': [4,5,3,2,1], '🚛': [5,4,3,2,1] },
	6: { '🏎️': [5,4,3,2,1], '🚘': [4,5,4,3,2], '🚓': [3,4,5,4,3], '🚒': [3,4,5,4,3], '🚛': [2,3,4,5,4] },
	7: { '🏎️': [5,4,3,2,1], '🚘': [4,5,4,3,2], '🚓': [1,2,3,4,5], '🚒': [3,4,5,4,3], '🚛': [2,3,4,5,4] },
	8: { '🏎️': [3,4,5,4,3], '🚘': [4,5,4,3,2], '🚓': [4,5,4,3,2], '🚒': [5,4,3,2,1], '🚛': [4,5,3,2,1] },
	9: { '🏎️': [2,3,4,5,4], '🚘': [3,4,5,4,3], '🚓': [4,5,4,3,2], '🚒': [3,4,5,4,3], '🚛': [5,4,3,2,1] },
	10:{ '🏎️': [4,5,4,3,2], '🚘': [5,4,3,2,1], '🚓': [3,4,5,4,3], '🚒': [3,4,5,4,3], '🚛': [3,4,5,4,3] },
};

export interface DecodedToken extends JwtPayload {
	id: string;
	username: string;
}

export const POST = async (req: Request): Promise<Response> => {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new Response(JSON.stringify({ error: 'Access token이 필요합니다.' }), { status: 401 });
		}
		
		const token = authHeader.split(' ')[1];
		
		// ✅ JWT 디코딩
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
		} catch (err) {
			console.error('❌ Invalid token:', err);
			return new Response(JSON.stringify({ error: '유효하지 않은 토큰입니다.' }), { status: 401 });
		}
		
		const username = decoded?.username;
		if (!username) {
			return new Response(JSON.stringify({ error: '토큰에 username이 없습니다.' }), { status: 400 });
		}
		
		// ✅ 유저 확인
		const { data: user, error: userError } = await supabase
			.from('user')
			.select('*')
			.eq('username', username)
			.single();
		
		if (userError || !user) {
			console.error('❌ 유저 확인 실패:', userError);
			return new Response(JSON.stringify({ error: '유효하지 않은 사용자입니다.' }), { status: 401 });
		}
		
		// ✅ answers 받기
		const { answers } = await req.json();
		console.log("answers:", answers);
		
		if (!answers || typeof answers !== 'object' || Object.keys(answers).length !== 10) {
			return new Response(JSON.stringify({ error: '10개의 답변이 필요합니다.' }), { status: 400 });
		}
		
		// ✅ 차량별 총점 계산
		const totalScores: Record<CarType, number> = { '🏎️': 0, '🚘': 0, '🚓': 0, '🚒': 0, '🚛': 0 };
		
		for (const [key, value] of Object.entries(answers)) {
			const qNum = Number(key);
			const answer = Number(value);
			const mapping = scoreMap[qNum];
			if (!mapping) continue;
			
			(Object.keys(mapping) as CarType[]).forEach((carType) => {
				totalScores[carType] += mapping[carType][answer - 1];
			});
		}
		
		// ✅ 각 차량별 최대 가능 점수 계산
		const maxTotalPerCar: Record<CarType, number> = { '🏎️': 0, '🚘': 0, '🚓': 0, '🚒': 0, '🚛': 0 };
		for (const [, mapping] of Object.entries(scoreMap)) {
			(Object.keys(mapping) as CarType[]).forEach((carType) => {
				maxTotalPerCar[carType] += Math.max(...mapping[carType]);
			});
		}
		
		// ✅ 퍼센트 계산 (정규화 방식)
		const percentages: Record<CarType, number> = { '🏎️': 0, '🚘': 0, '🚓': 0, '🚒': 0, '🚛': 0 };
		(Object.keys(totalScores) as CarType[]).forEach((car) => {
			const maxScore = maxTotalPerCar[car];
			const normalized = (totalScores[car] / maxScore) * 100;
			percentages[car] = Math.round(normalized);
		});
		
		// ✅ 최고 점수 차량 결정
		const bestCar = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0] as CarType;
		
		// ✅ 결과 저장
		const nowIso = new Date().toISOString();
		const { error: insertError } = await supabase.from('result').insert([
			{
				user_uuid: user.uuid,
				car_id: getCarCode(bestCar),
				created_at: nowIso,
			},
		]);
		
		if (insertError) {
			console.error('Insert error:', insertError);
			return new Response(JSON.stringify({ error: '결과 저장 실패' }), { status: 500 });
		}
		
		// ✅ 차량 정보 가져오기
		const { data: carData } = await supabase
			.from('car')
			.select('*')
			.eq('car_id', getCarCode(bestCar))
			.single();
		
		return new Response(
			JSON.stringify({
				username,
				result: bestCar,
				scores: totalScores,
				percentages,
				bestPercentage: percentages[bestCar] ?? null,
				car: carData,
			}),
			{ status: 200 }
		);
	} catch (err) {
		console.error('POST /mbti/result error:', err);
		return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { status: 500 });
	}
};