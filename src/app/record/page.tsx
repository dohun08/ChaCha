'use client';

import Image from 'next/image';
import {RecordData, useRecord} from '@/hooks/useRecord';

export default function RecentResultsPage() {
	const { data: records, isLoading } = useRecord() as { data: RecordData[]; isLoading: boolean };
	
	// 카드 제목에서 차량 유형 추출 (예: "당신은 스포츠카입니다" -> "스포츠카")
  const getCarType = (title: string) => {
    const typeMatch = title.match(/(스포츠카|전기차|경찰차|소방차|트럭)/);
    return typeMatch ? typeMatch[0] : null;
  };
	
	return (
		<div className="min-h-screen bg-[#121212] text-white flex flex-col items-center py-24 px-4">
			{/* 제목 */}
			<h1 className="text-3xl font-bold mt-5">최근 성격 기록</h1>
			{/* 카드 그리드 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
				{records?.length > 0 && records.map((record) => (
					<div
						key={record.id}
						className="bg-white rounded-2xl flex items-center p-4 shadow-md text-black hover:shadow-lg transition-shadow"
					>
						<Image src={record.image} alt="car" width={80} height={80} className="mr-4" />
						<div>
							<p className="font-semibold">{record.title}</p>
							<p className="text-gray-500 text-sm">{record.date}</p>
						</div>
					</div>
				))}
			</div>
			
			{isLoading && <p className="mt-4 text-gray-400">로딩중...</p>}
			{!isLoading && records?.length === 0 && (
				<p className="mt-10 text-gray-400">저장된 결과가 없습니다. 테스트를 진행해보세요!</p>
			)}
		</div>
	);
}