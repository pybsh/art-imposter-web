import { create } from "zustand";
import { useUserStore } from "./useUserStore";
import { useTopicStore } from "./useTopicStore";
import { useSpyStore } from "./useSpyStore";

type WebSocketState = {
  websocket: WebSocket | null;
  connect: (url: string, name: string) => void;
  disconnect: (name: string) => void;
  connectManage: (url: string) => void;
  disconnectManage: () => void;
  sendMessage: (message: string) => void;
};

export const useWebSocketStore = create<WebSocketState>((set) => ({
  websocket: null,

  connect: (url, name) => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket 연결 성공");
      ws.send(`{"type": "join", "user": "${name}"}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.type === 'topic') {
        const { setTopic } = useTopicStore.getState();
        setTopic(data.topic);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
      set({ websocket: null });
    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    set({ websocket: ws });
  },

  disconnect: (name) => {
    set((state) => {
      if (state.websocket && state.websocket.readyState === WebSocket.OPEN) {
        state.websocket.send(`{"type": "leave", "user": "${name}"}`);
        state.websocket.close();
      }
      return { websocket: null };
    });
  },

  connectManage: (url) => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log("WebSocket 연결 성공");
      ws.send(`{"type": "requestUserList"}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "userList") {
        const { setUserData } = useUserStore.getState();
        setUserData(data.users);
      }
      
      if (data.type === 'spyAssigned') {
        const { setSpy } = useSpyStore.getState();
        const { setTopic } = useTopicStore.getState();
        setTopic(data.topic);
        setSpy(data.spy);
      }
    };

    set({ websocket: ws });
  },

  disconnectManage: () => {
    set((state) => {
      if (state.websocket && state.websocket.readyState === WebSocket.OPEN) {
        state.websocket.close();
      }
      return { websocket: null };
    });
  },

  sendMessage: (message) => {
    set((state) => {
      if (state.websocket && state.websocket.readyState === WebSocket.OPEN) {
        state.websocket.send(message);
      } else {
        console.error("WebSocket이 연결되지 않았습니다.");
      }
      return {};
    });
  },
}));