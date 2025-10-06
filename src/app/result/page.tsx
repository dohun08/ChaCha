import CarModel from "@/containers/result/CarModel";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-[#111111]">
			<div className="bg-white text-black rounded-3xl w-[600px] shadow-2xl flex flex-col items-center py-10 px-8">
				<div className="w-full flex justify-center">
					<CarModel />
				</div>
				
				<p className="text-gray-400 pt-6 text-center loading-dots">
					당신의 성격은 마치
				</p>
				<h1 className="text-3xl font-bold mt-2 mb-6 fade-in opacity-0" style={{ animationDelay: '8s' }}>
					스포츠카
				</h1>
				
				<div className="text-left w-full">
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						대표 키워드
					</h2>
					<p className="text-gray-800 font-medium mb-6 fade-in opacity-0" style={{ animationDelay: '8.2s' }}>
						열정, 도전, 스피드, 모험, 독립
					</p>
					
					<h2 className="text-green-500 font-bold text-lg mb-1 fade-in opacity-0" style={{ animationDelay: '8.4s' }}>
						특징
					</h2>
					<p className="text-gray-800 leading-relaxed fade-in opacity-0" style={{ animationDelay: '8.4s' }}>
						새로운 일에 도전하는 것을 즐기고, 목표를 향해 빠르게 행동합니다.
						활발하고 자신감이 넘치며, 변화를 두려워하지 않습니다.
					</p>
				</div>
			</div>
		</main>
	);
}
