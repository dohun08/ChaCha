"use client";

import Image from "next/image";
import Button from "@/components/button";
import useNavigationWithTransition from "@/hooks/useNavigatonWithTransition";

export default function Header() {
  const {handleNavigate} = useNavigationWithTransition()

  return (
    <header className="w-full bg-[#1d1d1d] fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[66px]">
          {/* 로고 섹션 */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* 로고와 브랜드명 */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={()=>handleNavigate('/')}>
                <div className="relative w-32 h-32 sm:w-32 sm:h-32">
                <Image
                    src="/logo.svg"
                    alt="ChaCha Logo"
                    fill
                    className="object-contain"
                    priority
                />
                </div>
            </div>
          </div>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button onClick={() => handleNavigate('/result')} variant="primary" size="sm">
              로그인
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}