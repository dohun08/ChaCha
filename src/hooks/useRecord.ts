'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { useLoadingStore } from '@/store/useLoading';

interface RecordResponse {
	id: number;
	user_uuid: string;
	car_id: number;
	created_at: string;
}

export type RecordData = {
	id: number;
	title: string;
	date: string;
	image: string;
};

type CarInfo = { name: string; url: string };

const carModel: Record<number, CarInfo> = {
	1: { name: '스포츠카', url: '/sportcar.svg' },
	2: { name: '미래차', url: '/future.svg' },
	3: { name: '소방차', url: '/fire.svg' },
	4: { name: '경찰차', url: '/police.svg' },
	5: { name: '트럭', url: '/truck.svg' },
};

export const useRecord = () => {
	const { setIsLoading } = useLoadingStore();
	
	return useQuery<RecordData[], Error>({
		queryKey: ['records'],
		queryFn: async () => {
			setIsLoading(true);
			const res = await axiosInstance.get('/record');
			setIsLoading(false);
			
			const data: RecordResponse[] = res.data.records;
			return data.map((item) => ({
				id: item.id,
				title: carModel[item.car_id].name,
				date: item.created_at,
				image: carModel[item.car_id].url,
			}));
		}
	});
};