'use client';

import Image from 'next/image';
import axiosInstance from "@/lib/axiosInstance";
import {useEffect, useState} from "react";
import {useLoadingStore} from "@/store/useLoading";

interface RecordResponse {
	id: number,
	user_uuid: string,
	car_id: number,
	created_at: string
}

type RecordData = {
	id: number;
	title: string;
	date: string;
	image: string;
};

type CarInfo = { name: string; url: string };

const carModel : Record<number, CarInfo> = {
	1 : {
		name : "스포츠카",
		url : "/sportcar.svg"
	},
	2 : {
		name : "미래차",
		url : "/future.svg"
	},
	3 : {
		name : "소방차",
		url : "/fire.svg"
	},
	4 : {
		name : "경찰차",
		url : "/police.svg"
	},
	5 : {
		name : "트럭",
		url : "/truck.svg"
	},
}

export default function RecentResultsPage() {
	const [records, setRecords] = useState<RecordData[]>([]);
	const {setIsLoading} = useLoadingStore()
	const getRecord = async () =>{
		setIsLoading(true)
		const res = await axiosInstance.get("/record");
		if(res.status === 200){
			const data: RecordResponse[] = res.data.records;
			setIsLoading(false);
			setRecords(data?.map(item=>{
				return {
					id : item.id,
					title : carModel[item.car_id].name,
					date : item.created_at,
					image : carModel[item.car_id].url
				}
				})
			)
		}
	}
	
	useEffect(() => {
		getRecord();
	}, []);
	return (
		<div className="min-h-screen bg-[#121212] text-white flex flex-col items-center py-24 px-4">
			
			{/* 제목 */}
			<h1 className="text-3xl font-bold py-10">최근 성격 기록</h1>
			
			{/* 카드 그리드 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
				{records.map((record) => (
					<div
						key={record.id}
						className="bg-white rounded-2xl flex items-center p-4 shadow-md text-black"
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
