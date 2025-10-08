import {create} from 'zustand';

interface UseLoading{
	isLoading : boolean;
	setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<UseLoading>((set) => ({
	isLoading: false,
	setIsLoading: (isLoading: boolean) => set({isLoading}),
}));