"use client";

import { useState } from "react";
import QuestionCard from "@/containers/question/questionCard";
import { questions } from "@/constants/question";
import Button from "@/components/button";
import useNavigationWithTransition from "@/hooks/useNavigatonWithTransition";
import {useResultStore} from "@/store/useResult";
import axiosInstance from "@/lib/axiosInstance";
import {useNavigationTransitionStore} from "@/store/useNavigationTransition";
import {useLoadingStore} from "@/store/useLoading";

export default function Home() {
	const [answers, setAnswers] = useState<number[]>([]);
	
	const handleSelect = (id: number, value: number) => {
		setAnswers((prev) => ({ ...prev, [id]: value }));
	};
	
	const {setResult} = useResultStore();
	const {setIsLoading} = useLoadingStore()
	const {handleNavigate} = useNavigationWithTransition()
	const handleSubmit = async () => {
		setIsLoading(true)
		const res = await axiosInstance.post("/question", {
			answers : answers
		});
		
		if(res.status === 200) {
			setIsLoading(false);
			handleNavigate("/result");
			setResult(res.data.car);
		}
	};
	
	return (
		<main className="w-full min-h-screen py-20 bg-[#1d1d1d]/50 text-white flex flex-col items-center">
			
			{questions.map((q) => (
				<QuestionCard
					key={q.id}
					id={q.id}
					text={q.text}
					selected={answers[q.id] || null}
					onSelect={handleSelect}
					minText={q.minText}
					maxText={q.maxText}
				/>
			))}
			
			<Button
				variant="default"
				size="lg"
				onClick={handleSubmit}
			>
				제출하기
			</Button>
		</main>
	);
}