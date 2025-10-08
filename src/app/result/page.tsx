"use client"

import CarModel from "@/containers/result/CarModel";
import {useResultStore} from "@/store/useResult";

export default function Home() {
	const {result} = useResultStore();
	if(!result) return <>아직 데이터가 없습니다..</>
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-[#111111]">
			<div className="bg-white h-[650px] overflow-y-auto text-black rounded-3xl w-[600px] shadow-2xl flex flex-col items-center py-10 px-8">
				<div className="w-full flex justify-center">
					<CarModel carName={result.car_name} />
				</div>
				
				<p className="text-gray-400 pt-6 text-center loading-dots">
					당신의 성격은 마치
				</p>
				<h1 className="text-3xl font-bold mt-2 mb-6 fade-in opacity-0" style={{ animationDelay: '8s' }}>
					{result.car_name}
				</h1>
				
				<div className="text-left w-full">
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						대표 키워드
					</h2>
					<p className="text-gray-800 font-medium mb-6 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						{result.keyword}
					</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.4s' }}>
						특징
					</h2>
					<p className="text-gray-800 leading-relaxed fade-in opacity-0" style={{ animationDelay: '8.4s' }}>
						{result.future}
					</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						장점
					</h2>
					<p className="text-gray-800 font-medium mb-6 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						{result.great}
					</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						단점
					</h2>
					<p className="text-gray-800 font-medium mb-6 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						{result.bad}
					</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						행동경향
					</h2>
					<p className="text-gray-800 font-medium mb-6 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						{result.moveStyle}
					</p>
				
				</div>
			</div>
		</main>
	);
}
