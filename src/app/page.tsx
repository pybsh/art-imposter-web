"use client";

import { useNameStore } from "./store/useNameStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { name, setName } = useNameStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const navigateToDrawing = () => {
    if(name != "") router.push("/drawing.html");
    console.log("test");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8" style={{color: "black"}}>이름을 입력하세요</h1>
      <input
        type="text"
        placeholder="이름"
        onChange={handleInputChange}
        className="p-3 border rounded-lg w-64 mb-4"
        style={{color: "black"}}
      />
      <button
        className="p-3 bg-blue-500 text-white rounded-lg"
        onClick={navigateToDrawing}
      >
        확인
      </button>
    </div>
  );
}