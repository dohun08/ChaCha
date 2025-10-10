import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
	username: string;
	setUser: (username: string) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			username: "",
			setUser: (username: string) => set({ username }),
			clearUser: () => set({ username: "" }),
		}),
		{
			name: 'user',
		}
	)
);