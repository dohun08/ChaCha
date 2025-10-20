import {create} from 'zustand';

interface Result{
	// 새 필드: 최종 차량 이모지 및 퍼센트 맵, 점수 맵 포함
	result: string;
	percentages?: Record<string, number>;
	scores?: Record<string, number>;
	car_name : string;
	future : string;
	keyword : string;
	great : string;
	bad : string;
	moveStyle : string;
}
interface UseResult{
	result : Result | null;
	setResult : (result : Result | null) => void;
}

export const useResultStore = create<UseResult>((set) => ({
	result : null,
	setResult : (result: Result | null) => set({result})
}));