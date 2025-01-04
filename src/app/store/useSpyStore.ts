import { create } from "zustand";

type SpyStore = {
  spy: string;
  setSpy: (spy: string) => void;
};

export const useSpyStore = create<SpyStore>((set) => ({
    spy: "",
    setSpy: (spy) => set({ spy }),
}));