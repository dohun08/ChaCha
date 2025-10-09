'use client';

import Image from 'next/image';
import {RecordData, useRecord} from '@/hooks/useRecord';

export default function RecentResultsPage() {
	const { data: records, isLoading } = useRecord() as { data: RecordData[]; isLoading: boolean };
	
	return (
		<div className="min-h-screen bg-[#121212] text-white flex flex-col items-center py-24 px-4">
			{/* 제목 */}
			<h1 className="text-3xl font-bold py-10">최근 성격 기록</h1>
			
			{/* 카드 그리드 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
				{records?.length > 0 && records.map((record) => (
					<div
						key={record.id}
						className="bg-white rounded-2xl flex items-center p-4 shadow-md text-black"
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
		</div>
	);
}