import { supabase } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

interface SignupRequest {
	username: string;
	password: string;
	rePassword: string;
}

export const POST = async (req: Request): Promise<Response> => {
	try {
		const body: SignupRequest = await req.json();
		const { username, password, rePassword } = body;
		
		if (!username || !password || !rePassword) {
			return new Response(JSON.stringify({ error: '모든 필드를 입력해주세요.' }), { status: 400 });
		}
		
		if (password !== rePassword) {
			return new Response(JSON.stringify({ error: '비밀번호가 일치하지 않습니다.' }), { status: 400 });
		}
		
		// 1️⃣ username 중복 확인
		const { data: existingUser } = await supabase
			.from('user')
			.select('username')
			.eq('username', username)
			.single();
		
		if (existingUser) {
			return new Response(JSON.stringify({ error: '이미 존재하는 아이디입니다.' }), { status: 400 });
		}
		
		// 2️⃣ 비밀번호 해싱
		const hashedPassword = await bcrypt.hash(password, 10);
		
		// 3️⃣ DB에 저장
		const { data: newUser, error } = await supabase
			.from('user')
			.insert([{ username, password: hashedPassword }])
			.select()
			.single();
		console.log(error)
		if (error || !newUser) {
			return new Response(JSON.stringify({ error: '회원가입에 실패했습니다.' }), { status: 500 });
		}
		
		return new Response(
			JSON.stringify({
				message: '회원가입 성공',
				user: { id: newUser.id, username: newUser.username },
			}),
			{ status: 200 }
		);
	} catch (err) {
		console.error('POST /signup Error:', err);
		return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { status: 500 });
	}
};