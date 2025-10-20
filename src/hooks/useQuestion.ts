'use client';

import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import useNavigationWithTransition from '@/hooks/useNavigatonWithTransition';
import { useLoadingStore } from '@/store/useLoading';
import {useResultStore} from "@/store/useResult";

interface Answers {
	[key: number]: number; // {1:2, 2:3, ...}
}

interface QuestionResponse {
	username: string;
	result: string; // 차량 이모지
	scores: Record<string, number>;
	percentages?: Record<string, number>; // 서버에서 오는 퍼센트 맵
	car: {
		car_id: number;
		car_name: string;
		future: string;
		keyword: string;
		great: string;
		bad: string;
		moveStyle: string;
	}
}

export const useQuestion = () => {
	const { setIsLoading } = useLoadingStore();
	const { handleNavigate } = useNavigationWithTransition();
	const {setResult} = useResultStore()
	const submitQuestion = useMutation({
		mutationFn: async (answers: Answers): Promise<QuestionResponse> => {
			setIsLoading(true);
			const res = await axiosInstance.post<QuestionResponse>('/question', { answers });
			return res.data;
		},
		onSuccess: (data) => {
			setIsLoading(false);
			handleNavigate('/result');
			setResult({
				result: data.result,
				percentages: data.percentages ?? {},
				scores: data.scores ?? {},
				car_name: data.car.car_name,
				future: data.car.future,
				keyword: data.car.keyword,
				great: data.car.great,
				bad: data.car.bad,
				moveStyle: data.car.moveStyle,
			});
			console.log('최종 차량 결과:', data.result, data.car);
		},
		onError: (err) => {
			setIsLoading(false);
			console.error('질문 제출 실패:', err);
			alert('❌ 질문 제출 실패');
		},
	});
	
	return {
		submitQuestion,
	};
};