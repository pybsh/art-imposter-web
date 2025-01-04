import { create } from "zustand";

type DrawingStore = {
  imageSrc: string;
  setImageSrc: (src: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isImageLoading: boolean;
  setIsImageLoading: (loading: boolean) => void;
};

export const useDrawingStore = create<DrawingStore>((set) => ({
  imageSrc: "https://http.cat/404",
  setImageSrc: (src) => set({ imageSrc: src }),
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isImageLoading: false,
  setIsImageLoading: (loading) => set({ isImageLoading: loading }),
}));