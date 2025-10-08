import {create} from 'zustand';

interface Result{
	car_name : string,
	future : string;
	keyword : string;
	great : string;
	bad : string;
	moveStyle : string;
}
interface UseResult{
	result : Result | null;
	setResult : (result : Result) => void;
}

export const useResultStore = create<UseResult>((set) => ({
	result : null,
	setResult : (result: Result | null) => set({result})
}));