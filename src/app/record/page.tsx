'use client';

import Image from 'next/image';
import {RecordData, useRecord} from '@/hooks/useRecord';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 차량 유형과 이모지, 색상 매핑
const carTypeDetails = {
  '스포츠카': { emoji: '🏎️', color: 'rgba(54, 162, 235, 0.8)' },
  '전기차': { emoji: '🚗⚡', color: 'rgba(75, 192, 192, 0.8)' },
  '경찰차': { emoji: '🚓', color: 'rgba(153, 102, 255, 0.8)' },
  '소방차': { emoji: '🚒', color: 'rgba(255, 99, 132, 0.8)' },
  '트럭': { emoji: '🚚', color: 'rgba(255, 206, 86, 0.8)' },
};

export default function RecentResultsPage() {
	const { data: records, isLoading } = useRecord() as { data: RecordData[]; isLoading: boolean };
	
	// 카드 제목에서 차량 유형 추출 (예: "당신은 스포츠카입니다" -> "스포츠카")
  const getCarType = (title: string) => {
    const typeMatch = title.match(/(스포츠카|전기차|경찰차|소방차|트럭)/);
    return typeMatch ? typeMatch[0] : null;
  };

  // 차트 데이터 준비
  const prepareChartData = () => {
    if (!records || records.length < 2) return null;

    const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = sortedRecords.map(r => r.date);
	  
	  const datasets = Object.entries(carTypeDetails).map(([carName, details]) => {
		  const data = sortedRecords.map(record => {
			  return getCarType(record.title) === carName ? 100 : 0;
		  });
		  
		  return {
			  label: carName,
			  data,
			  borderColor: details.color,
			  backgroundColor: details.color.replace('0.8', '0.2'),
			  tension: 0.4,
			  fill: true,   // 라인 아래 색상 채움
			  pointRadius: 5,
			  pointHoverRadius: 7,
			  pointBackgroundColor: details.color,
		  };
	  });

    return { labels, datasets };
  };

  const chartData = prepareChartData();
	
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'index' as const,
			intersect: false,
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 100,
				title: { display: true, text: '포함도 (%)', color: '#e5e7eb' },
				ticks: { color: '#9ca3af', stepSize: 20 },
				grid: { color: 'rgba(255, 255, 255, 0.1)' },
			},
			x: {
				title: { display: true, text: '날짜', color: '#e5e7eb' },
				ticks: { color: '#9ca3af' },
				grid: { color: 'rgba(255, 255, 255, 0.1)' },
			},
		},
		plugins: {
			legend: {
				position: 'top' as const,
				labels: { color: '#e5e7eb', usePointStyle: true, pointStyle: 'circle' },
			},
			tooltip: {
				enabled: true,
				callbacks: {
					// @ts-expect-error: tooltipItem 타입을 임시로 무시
					label: function (tooltipItem) {
						return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y}%`;
					}
				},
			},
		},
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

      {/* 성격 변화 그래프 */}
      {chartData && (
        <div className="w-full max-w-4xl mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">나의 성격 유형 변화</h2>
          <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
		</div>
	);
}