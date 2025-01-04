import { create } from "zustand";

type TopicStore = {
  topic: string;
  setTopic: (topic: string) => void;
};

export const useTopicStore = create<TopicStore>((set) => ({
  topic: "",
  setTopic: (topic) => set({ topic }),
}));