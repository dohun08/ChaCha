import { supabase } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginRequest {
	username: string;
	password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const POST = async (req: Request): Promise<Response> => {
	try {
		const body: LoginRequest = await req.json();
		const { username, password } = body;
		
		if (!username || !password) {
			return new Response(JSON.stringify({ error: '아이디와 비밀번호를 입력해주세요.' }), { status: 400 });
		}
		
		const { data: users, error } = await supabase
			.from('user')
			.select('*')
			.eq('username', username)
			.single();
		
		console.log(users, username)
		if (error || !users) {
			return new Response(JSON.stringify({ error: '사용자를 찾을 수 없습니다.' }), { status: 401 });
		}
		
		const user = users;
		
		// 2️⃣ 비밀번호 검증
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return new Response(JSON.stringify({ error: '비밀번호가 일치하지 않습니다.' }), { status: 401 });
		}
		
		// 3️⃣ JWT 생성
		const token = jwt.sign(
			{
				id: user.uuid,
				username: user.username,
				name: user.name,
				email: user.email,
			},
			JWT_SECRET,
			{ expiresIn: '30d' }
		);
		
		// 4️⃣ 성공 응답
		return new Response(
			JSON.stringify({
				message: '로그인 성공',
				token,
				user: {
					id: user.id,
					username: user.username,
					name: user.name,
					email: user.email,
				},
			}),
			{ status: 200 }
		);
		
	} catch (err) {
		console.error('POST /login Error:', err);
		return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { status: 500 });
	}
};