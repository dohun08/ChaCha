import {create} from 'zustand';

interface UseNavigationTransition{
	showTravel: boolean;
	setShowTravel: (showTravel: boolean) => void;
}

export const useNavigationTransitionStore = create<UseNavigationTransition>((set) => ({
  showTravel: false,
  setShowTravel: (showTravel: boolean) => set({showTravel}),
}));