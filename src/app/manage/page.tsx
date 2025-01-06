"use client";

import { useEffect, useState } from "react";
import { useWebSocketStore } from "../store/useWebSocketStore";
import { useUserStore } from "../store/useUserStore";
import { useSpyStore } from "../store/useSpyStore";
import { useTopicStore } from "../store/useTopicStore";

export default function ManagePage() {
  const { connectManage, sendMessage, disconnectManage } = useWebSocketStore();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const { userData } = useUserStore();
  const { spy } = useSpyStore(); // 스파이 정보
  const { topic } = useTopicStore(); // 주제 정보

  const [showSpyModal, setShowSpyModal] = useState(false); // 스파이 모달 상태
  const [showTopicModal, setShowTopicModal] = useState(false); // 주제 모달 상태

  const topics = ["과일", "음료수", "학교", "스포츠", "교통수단"];

  useEffect(() => {
    connectManage(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    return () => {
      disconnectManage();
    };
  }, [connectManage, disconnectManage]);

  const handleButtonClick = () => {
    if (selectedTopic) {
      console.log(`Selected topic: ${selectedTopic}`);
      sendMessage(JSON.stringify({ type: "selectTopic", topic: selectedTopic }));
    } else {
      alert("주제를 선택해주세요!");
    }
  };

  const handleResetUserList = () => {
    sendMessage(JSON.stringify({ type: "ClearAllCathy" }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">art-imposter</h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border rounded"
            style={{ color: "black" }}
          >
            <option value="" disabled>
              주제 선택
            </option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
      {userData.map((user, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{user.user}</h2>
            <img
              src={user.image || "https://http.cat/404"}
              alt={`${user.user} 이미지`}
              className="w-full h-auto mt-2"
            />
          </div>
        ))}
      </div>
      {/* 왼쪽 아래 userList 초기화 버튼 */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={handleResetUserList}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          초기화
        </button>
      </div>
      {/* 새로운 버튼들 */}
      <div className="fixed bottom-4 right-4 space-y-2 flex flex-col items-end">
        <button
          onClick={() => setShowSpyModal(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          스파이 공개
        </button>
        <button
          onClick={() => setShowTopicModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          주제 공개
        </button>
      </div>

      {/* 스파이 모달 */}
      {showSpyModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg relative">
            <button
              onClick={() => setShowSpyModal(false)}
              className="absolute top-2 right-2 text-black font-bold"
            >
              ✖
            </button>
            <h1 className="text-2xl font-bold mb-4 text-black">스파이 공개</h1>
            <p className="text-lg text-black">{spy || "스파이가 없습니다."}</p>
          </div>
        </div>
      )}

      {/* 주제 모달 */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg relative">
            <button
              onClick={() => setShowTopicModal(false)}
              className="absolute top-2 right-2 text-black font-bold"
            >
              ✖
            </button>
            <h1 className="text-2xl font-bold mb-4 text-black">주제 공개</h1>
            <p className="text-lg text-black">{topic || "주제가 없습니다."}</p>
          </div>
        </div>
      )}
    </div>
  );
}