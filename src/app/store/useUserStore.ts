import { create } from 'zustand';

type User = {
  user: string;
  image: string;
};

type UserStore = {
  userData: User[];
  setUserData: (data: User[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: [],
  setUserData: (data) => set({ userData: data }),
}));