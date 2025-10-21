'use client';
declare global {
	interface Window {
		Kakao: {
			init: (key: string) => void;
			isInitialized: () => boolean;
			Share: {
				sendDefault: (obj: {
					objectType: string;
					content: {
						title: string;
						description?: string;
						imageUrl?: string;
						link: {
							mobileWebUrl: string;
							webUrl: string;
						};
					};
					buttons?: Array<{
						title: string;
						link: {
							mobileWebUrl: string;
							webUrl: string;
						};
					}>;
				}) => void;
			};
		};
	}
}
import CarModel from "@/containers/result/CarModel";
import { useResultStore } from "@/store/useResult";
import { useEffect, useState } from "react";

export default function Home() {
	const { result } = useResultStore();
	if (!result) return <>아직 데이터가 없습니다..</>;
	
	const percentForResult = result?.percentages?.[result.result] ?? 0;
	
	// ----------------------
	// 카카오톡 공유
	// ----------------------
	const shareKakao = () => {
		if (!window.Kakao && process.env.NEXT_PUBLIC_KAKAO_KEY) {
			const script = document.createElement('script');
			script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
			script.async = true;
			script.onload = initKakao;
			document.head.appendChild(script);
		} else {
			initKakao();
		}
	};
	
	const initKakao = () => {
		const key = process.env.NEXT_PUBLIC_KAKAO_KEY;
		if (!key) return;
		if (!window.Kakao.isInitialized()) {
			window.Kakao.init(key);
		}
		window.Kakao.Share.sendDefault({
			objectType: 'feed',
			content: {
				title: '나의 성격 결과 공유',
				description: `${result.car_name}와 비슷한 내 성격 결과!`,
				imageUrl: 'https://cha-cha-3ejd.vercel.app/logo.png', // 원하는 이미지
				link: {
					mobileWebUrl: 'https://cha-cha-3ejd.vercel.app/',
					webUrl: 'https://cha-cha-3ejd.vercel.app/',
				},
			},
			buttons: [
				{
					title: '결과 확인하기',
					link: {
						mobileWebUrl: 'https://cha-cha-3ejd.vercel.app/',
						webUrl: 'https://cha-cha-3ejd.vercel.app/',
					},
				},
			],
		});
	};
	
	// ----------------------
	// CircleGauge
	// ----------------------
	const CircleGauge = ({ percent }: { percent: number }) => {
		const [animated, setAnimated] = useState(0);
		useEffect(() => {
			const t = setTimeout(() => setAnimated(percent), 300);
			return () => clearTimeout(t);
		}, [percent]);
		
		const size = 120;
		const stroke = 10;
		const center = size / 2;
		const normalizedRadius = center - stroke / 2;
		const circumference = normalizedRadius * 2 * Math.PI;
		const strokeDashoffset = circumference - (animated / 100) * circumference;
		
		const primary = 'var(--primary,#2563EB)';
		const color = percent >= 66 ? primary : percent >= 33 ? '#FFDF40' : '#FF4040';
		
		return (
			<div className="relative w-full h-full">
				<svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full block">
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
						style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.9,.24,1), stroke 0.3s' }}
						r={normalizedRadius}
						cx={center}
						cy={center}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
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
				
				<div className="w-full flex justify-center mt-4 fade-in opacity-0" style={{ animationDelay: '8.1s' }}>
					<div className="relative w-[120px] h-[120px]">
						<CircleGauge percent={percentForResult} />
					</div>
				</div>
				
				
				{/* 나머지 정보 */}
				<div className="text-left w-full mt-6">
					<h2 className="text-green-500 font-bold text-lg mb-1">대표 키워드</h2>
					<p className="text-gray-800 font-medium mb-6">{result.keyword}</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1">특징</h2>
					<p className="text-gray-800 leading-relaxed mb-6">{result.future}</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1">장점</h2>
					<p className="text-gray-800 font-medium mb-6">{result.great}</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1">단점</h2>
					<p className="text-gray-800 font-medium mb-6">{result.bad}</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1">행동경향</h2>
					<p className="text-gray-800 font-medium mb-6">{result.moveStyle}</p>
				</div>
				
				{/* 공유 버튼 */}
				<button
					className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition"
					onClick={shareKakao}
				>
					카카오톡으로 공유하기
				</button>
			</div>
		</main>
	);
}