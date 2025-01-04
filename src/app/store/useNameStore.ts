import { create } from "zustand";

type NameStore = {
  name: string;
  setName: (name: string) => void;
};

export const useNameStore = create<NameStore>((set) => ({
  name: "",
  setName: (name) => set({ name }),
}));