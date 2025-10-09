'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/button';
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		rePassword: ''
	});
	
	const { signup } = useAuth();
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// 비밀번호 확인
		if (formData.password !== formData.rePassword) {
			alert('❌ 비밀번호가 일치하지 않습니다.');
			return;
		}
		
		// Mutation 호출
		try {
			await signup.mutateAsync(formData);
			// 성공 시 onSuccess 내부에서 로그인 페이지로 이동 처리됨
		} catch (err) {
			console.error('Signup failed', err);
		}
	};
	
	return (
		<main className="relative w-screen h-screen bg-[#1d1d1d]/60 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl p-8 w-full max-w-sm sm:max-w-md flex flex-col items-center">
				{/* 로고 섹션 */}
				<div className="relative w-48 h-24">
					<Image src="/logo.svg" alt="ChaCha Logo" fill className="object-contain" priority />
				</div>
				
				{/* 회원가입 폼 */}
				<form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6">
					<div className="relative">
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							placeholder="아이디를 입력해주세요"
							className="text-black w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base transition-all"
						/>
						<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
							<Image src="/people.svg" alt="People Icon" width={20} height={20} className="sm:w-6 sm:h-6 object-contain z-0" />
						</div>
					</div>
					
					<div className="relative">
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="비밀번호를 입력해주세요"
							className="text-black w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base transition-all"
						/>
						<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
							<Image src="/password.svg" alt="Password Icon" width={18} height={18} className="text-gray-400 sm:w-5 sm:h-5" />
						</div>
					</div>
					
					<div className="relative">
						<input
							type="password"
							name="rePassword"
							value={formData.rePassword}
							onChange={handleInputChange}
							placeholder="비밀번호를 다시 입력해주세요"
							className="text-black w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base transition-all"
						/>
						<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
							<Image src="/password.svg" alt="Password Icon" width={18} height={18} className="text-gray-400 sm:w-5 sm:h-5" />
						</div>
					</div>
					
					<Button
						type="submit"
						variant="primary"
						className="w-full py-3 text-sm sm:text-base font-extrabold rounded-lg"
					>
						회원가입
					</Button>
				</form>
			</div>
		</main>
	);
}