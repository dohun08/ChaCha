'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import useNavigationWithTransition from '@/hooks/useNavigatonWithTransition';
import Button from '@/components/button';

export default function Login() {
	const { login } = useAuth();
	const { handleNavigate } = useNavigationWithTransition();
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		
		try {
			await login.mutateAsync(formData);
		} catch (error) {
			console.error('Login error:', error);
			setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<main className="relative w-screen h-screen bg-[#1d1d1d]/60 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl p-8 w-full max-w-sm sm:max-w-md flex flex-col items-center">
				<div className="relative w-48 h-24">
					<Image
						src="/logo.svg"
						alt="ChaCha Logo"
						fill
						className="object-contain"
						priority
					/>
				</div>
				
				{error && (
					<div className="w-full mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
						{error}
					</div>
				)}
				
				<form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
					<div>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							placeholder="아이디를 입력해주세요"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>
					
					<div>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="비밀번호를 입력해주세요"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>
					
					<Button
						type="submit"
						className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						disabled={isLoading || login.isPending}
					>
						{isLoading || login.isPending ? '로그인 중...' : '로그인'}
					</Button>
				</form>
				
				<div className="mt-4 text-sm text-gray-600">
					아직 회원이 아니신가요?{' '}
					<a
						href="/signup"
						className="text-blue-600 hover:underline"
						onClick={(e) => {
							e.preventDefault();
							handleNavigate('/signup');
						}}
					>
						회원가입
					</a>
				</div>
			</div>
		</main>
	);
}