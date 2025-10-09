'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { useUserStore } from '@/store/useUser';
import useNavigationWithTransition from "@/hooks/useNavigatonWithTransition";
import {useLoadingStore} from "@/store/useLoading";


interface LoginForm {
	username: string;
	password: string;
}

interface SignupForm {
	username: string;
	password: string;
	rePassword: string;
}

interface AuthResponse {
	data: {
		user: { username: string };
		token: string;
	}
}

export const useAuth = () => {
	const setUser = useUserStore((state) => state.setUser);
	const { handleNavigate } = useNavigationWithTransition();
	const queryClient = useQueryClient();
	const {setIsLoading} = useLoadingStore()
	
	// ✅ 로그인 mutation
	const loginMutation = useMutation({
		mutationFn: async (formData: LoginForm): Promise<AuthResponse> => {
			setIsLoading(true)
			return await axiosInstance.post('/auth/login', formData);
		},
		onSuccess: (data) => {
			setIsLoading(false)
			setUser(data.data.user.username);
			localStorage.setItem('access_token', data.data.token);
			localStorage.setItem('username', data.data.user.username);
			
			queryClient.clear();
			handleNavigate('/');
		},
		onError: (error) => {
			setIsLoading(false)
			alert('❌ 로그인 실패: ' );
			console.error(error)
		},
	});
	
	// ✅ 회원가입 mutation
	const signupMutation = useMutation({
		mutationFn: async (formData: SignupForm): Promise<AuthResponse> => {
			setIsLoading(true)
			return await axiosInstance.post('/auth/signup', formData);
		},
		onSuccess: () => {
			setIsLoading(false)
			handleNavigate('/login');
		},
		onError: (error) => {
			setIsLoading(false)
			alert('❌ 회원가입 실패: ' + (error));
			console.error(error)
		},
	});
	
	return {
		login: loginMutation,
		signup: signupMutation,
	};
};