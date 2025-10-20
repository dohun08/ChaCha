"use client";

import Image from "next/image";
import Button from "@/components/button";
import useNavigationWithTransition from "@/hooks/useNavigatonWithTransition";
import {useUserStore} from "@/store/useUser";

export default function Header() {
  const {handleNavigate} = useNavigationWithTransition()
	const {username} = useUserStore()
  return (
    <header className="w-full bg-[#1d1d1d] fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[66px]">
          {/* 로고 섹션 */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* 로고와 브랜드명 */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={()=>handleNavigate('/')}>
                <div className="relative w-12 h-12 sm:w-32 sm:h-32">
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
          <div className="flex items-center sm:space-x-4">
	          {username ?
		          <div
			          className="flex items-center space-x-2 cursor-pointer"
			          onClick={()=>handleNavigate("/record")}
		          >
			          <div className="">
				          <Image
					          src="/people2.svg"
					          alt="People Icon"
					          width={20}
					          height={20}
					          className="sm:w-6 sm:h-6 w-5 h-5 object-contain z-0"
				          />
			          </div>
			          <p className={"text-white text-sm sm:text-xl font-bold"}>{username}</p>
		          </div>
		          : <Button onClick={() => handleNavigate('/login')} variant="primary" size="sm" className="px-3 py-1 text-sm">
			          로그인
		          </Button>
						}
          </div>
        </div>
      </div>
    </header>
  );
}