"use client"

import CarModel from "@/containers/result/CarModel";
import {useResultStore} from "@/store/useResult";
import { useEffect, useState } from "react";

export default function Home() {
	const {result} = useResultStore();
	if(!result) return <>아직 데이터가 없습니다..</>

	// result.result: API에서 반환한 bestCar (예: '🏎️')
	// result.percentages: API에서 반환한 퍼센트 맵 { '🏎️': 55, ... }
	console.log(result)
	const percentForResult = result?.percentages?.[result.result] ?? 0;

	// 원형 게이지 컴포넌트
	const CircleGauge = ({ percent }: { percent: number }) => {
		const [animated, setAnimated] = useState(0);
		useEffect(() => {
			const t = setTimeout(() => setAnimated(percent), 300);
			return () => clearTimeout(t);
		}, [percent]);

		// viewBox 기준 사이즈(부모 컨테이너의 크기에 맞춰 100%로 렌더)
		const size = 120;
		const stroke = 10;
		const center = size / 2;
		const normalizedRadius = center - stroke / 2;
		const circumference = normalizedRadius * 2 * Math.PI;
		const strokeDashoffset = circumference - (animated / 100) * circumference;

		const primary = 'var(--primary,#2563EB)';
		const color = percent >= 66 ? primary : percent >= 33 ? '#FFDF40' : '#FF4040';

		return (
			// 부모가 relative (페이지에서 이미 relative로 감쌌음)인 상태를 가정하되,
			// 이 컴포넌트 자체도 유연하게 동작하도록 width/height:100% 사용
			<div className="relative w-full h-full">
				<svg
					viewBox={`0 0 ${size} ${size}`}
					preserveAspectRatio="xMidYMid meet"
					className="w-full h-full block"
					aria-hidden
				>
					<circle
						stroke="#eee"
						fill="transparent"
						strokeWidth={stroke}
						r={normalizedRadius}
						cx={center}
						cy={center}
					/>
					<circle
						stroke={color}
						fill="transparent"
						strokeWidth={stroke}
						strokeLinecap="round"
						strokeDasharray={`${circumference} ${circumference}`}
						style={{
							strokeDashoffset,
							transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.9,.24,1), stroke 0.3s',
						}}
						r={normalizedRadius}
						cx={center}
						cy={center}
					/>
				</svg>

				{/* 중앙 숫자: 절대중앙에 고정해서 절대 삐져나오지 않음 */}
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
					{/* 작은 컨테이너에서도 넘치지 않도록 텍스트 사이즈/줄바꿈 제한 */}
					<div className="text-center">
						<div className="text-xl font-bold leading-none" style={{ color }}>
							{Math.round(animated)}%
						</div>
						<div className="text-sm text-gray-500">성격 포함도</div>
					</div>
				</div>
			</div>
		);
	};

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
				{/* 게이지 영역: fade-in 타이밍을 기존 애니메이션들과 맞춤 */}
				<div className="w-full flex justify-center mt-4 fade-in opacity-0" style={{ animationDelay: '8.1s' }}>
					{/* 부모 컨테이너 크기를 고정하고 내부 CircleGauge는 100%로 맞춤 */}
					<div className="relative w-[120px] h-[120px]">
						<CircleGauge percent={percentForResult} />
					</div>
				</div>
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
