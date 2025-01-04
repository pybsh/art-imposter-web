"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDrawingStore } from "../store/useDrawingStore";
import { useNameStore } from "../store/useNameStore";
import { useWebSocketStore } from "../store/useWebSocketStore";
import { useTopicStore } from "../store/useTopicStore";

export default function DrawingPage() {
  const {
    imageSrc,
    setImageSrc,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    isImageLoading,
    setIsImageLoading,
  } = useDrawingStore();

  const { topic } = useTopicStore();
  const { name } = useNameStore();
  const router = useRouter();
  const { connect, disconnect, sendMessage } = useWebSocketStore();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!name) {
      router.push("/");
    } else {
      connect(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`, name);
    }

    return () => {
      disconnect(name);
    };
  }, [name, connect, disconnect]);

  useEffect(() => {
    if (topic) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 10000); // 10초 동안 모달 표시
      return () => clearTimeout(timer);
    }
  }, [topic]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setIsImageLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SDXL_REQ_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text_input: inputValue }),
        }
      );

      if (!response.ok) {
        throw new Error("POST 요청 실패");
      }

      const data = await response.json();
      setImageSrc(data.image_path);

      setInputValue("");
    } catch (error) {
      console.error("이미지 업데이트 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendImageLink = () => {
    if (imageSrc) {
      sendMessage(`{"type": "upload", "user": "${name}", "src": "${imageSrc}"}`);
    } else {
      console.error("이미지 링크가 없습니다.");
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold mb-4" style={{color: "black"}}>주제</h1>
            <p className="text-lg" style={{color:"black"}}>{topic}</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 text-lg font-bold text-gray-700">
        {name || "이름 없음"}
      </div>

      <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-center mb-4 relative">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={imageSrc}
            alt="Dynamic Placeholder"
            onLoad={handleImageLoad}
            className={`w-full h-auto object-contain ${
              isImageLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
          />
        </div>
        <div className="flex flex-row items-center justify-center mb-4">
          <input
            type="text"
            placeholder="입력하세요..."
            style={{ color: "black" }}
            value={inputValue}
            onChange={handleInputChange}
            className="p-3 border rounded-lg w-full h-12 mr-4"
          />
          <button
            onClick={handleSendImageLink}
            className={`p-3 text-white h-12 rounded-lg w-16 m-2 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-400 to-sky-600"
            }`}
          >
            ☁
          </button>
          <button
            onClick={handleGenerateImage}
            className={`p-3 text-white h-12 rounded-lg w-16 m-2 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
            }`}
          >
            🎨
          </button>
        </div>
      </div>
    </div>
  );
}