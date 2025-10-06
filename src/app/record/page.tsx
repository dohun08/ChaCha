'use client';

import Image from 'next/image';

type Record = {
	id: number;
	title: string;
	date: string;
	image: string;
};

const records: Record[] = [
	{ id: 1, title: '스포츠카 성격', date: '2025-01-01', image: '/sportcar.svg' },
	{ id: 2, title: '스포츠카 성격', date: '2025-01-01', image: '/truck.svg' },
	{ id: 3, title: '스포츠카 성격', date: '2025-01-01', image: '/future.svg' },
	{ id: 4, title: '스포츠카 성격', date: '2025-01-01', image: '/fire.svg' },
	{ id: 5, title: '스포츠카 성격', date: '2025-01-01', image: '/police.svg' },
	{ id: 6, title: '스포츠카 성격', date: '2025-01-01', image: '/sportcar.svg' },
];

export default function RecentResultsPage() {
	return (
		<div className="min-h-screen bg-[#121212] text-white flex flex-col items-center py-24 px-4">
			
			{/* 제목 */}
			<h1 className="text-3xl font-bold py-10">최근 성격 기록</h1>
			
			{/* 카드 그리드 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
				{records.map((record) => (
					<div
						key={record.id}
						className="bg-white rounded-2xl flex items-center p-4 shadow-md text-black hover:scale-[1.02] transition"
					>
						<Image
							src={record.image}
							alt="car"
							width={80}
							height={80}
							className="mr-4"
						/>
						<div>
							<p className="font-semibold">{record.title}</p>
							<p className="text-gray-500 text-sm">{record.date}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
