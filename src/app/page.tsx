"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/button';
import useNavigationWithTransition from "@/hooks/useNavigatonWithTransition";
import {useUserStore} from "@/store/useUser";

// 성격 유형 데이터
const personalityTypes = {
  "스포츠카": {
    title: "스포츠카 – 열정·도전·스피드 (모험가형)",
    keywords: "열정, 도전, 스피드, 모험, 독립",
    traits: "새로운 일에 도전하는 것을 즐기고, 목표를 향해 빠르게 행동합니다. 활발하고 자신감이 넘치며, 변화를 두려워하지 않습니다.",
    strengths: "에너지가 넘치고, 주도적이며, 주변에 긍정적 자극을 줍니다.",
    weaknesses: "계획보다 즉흥적 선택을 선호하고, 가끔 성급하거나 세부적인 부분을 놓치기도 합니다.",
    behavior: "모험을 즐기며, 경쟁 상황에서 능력을 발휘하는 타입입니다.",
    emoji: "🏎️",
    bgColor: "from-blue-900/30 to-purple-900/30",
    iconBg: "bg-blue-500",
    textColor: "text-blue-400",
    accentColor: "text-blue-300"
  },
  "전기차": {
    title: "전기차(미래형) – 혁신·환경·미래지향 (미래형/진보가형)",
    keywords: "혁신, 창의, 미래, 환경, 진보",
    traits: "기존의 방식을 그대로 따르지 않고, 새로운 가능성과 아이디어를 탐색합니다. 사회적·환경적 가치에도 관심이 많습니다.",
    strengths: "창의적이고 통찰력이 뛰어나며, 문제 해결 시 새로운 접근법을 제시합니다.",
    weaknesses: "현실적인 제약에 부딪힐 때 답답함을 느낄 수 있으며, 구체적 실행보다는 아이디어에 집중할 때가 있습니다.",
    behavior: "미래를 바라보고 계획하며, 혁신적인 변화와 기술 도입을 즐깁니다.",
    emoji: "🚗⚡",
    bgColor: "from-green-900/30 to-teal-900/30",
    iconBg: "bg-green-500",
    textColor: "text-green-400",
    accentColor: "text-green-300"
  },
  "경찰차": {
    title: "경찰차 – 질서·정의·책임 (보호자형)",
    keywords: "질서, 정의, 책임, 안정, 신뢰",
    traits: "규칙과 질서를 중요하게 여기며, 주변 사람들을 보호하고 돕는 역할을 자주 맡습니다. 신뢰할 수 있는 존재입니다.",
    strengths: "책임감이 강하고, 조직적이며, 문제 상황에서도 침착하게 대응합니다.",
    weaknesses: "융통성이 부족할 수 있으며, 타인의 기대에 지나치게 맞추려는 경향이 있습니다.",
    behavior: "정의와 규칙을 중시하며, 다른 사람의 안전과 안정에 기여하려고 합니다.",
    emoji: "🚓",
    bgColor: "from-blue-900/30 to-indigo-900/30",
    iconBg: "bg-blue-600",
    textColor: "text-blue-400",
    accentColor: "text-blue-300"
  },
  "소방차": {
    title: "소방차 – 헌신·희생·타인 배려 (봉사/이타형)",
    keywords: "헌신, 희생, 배려, 도움, 협력",
    traits: "다른 사람의 필요를 우선시하고, 어려움에 처한 사람을 돕는 것을 즐깁니다. 타인에게 헌신적입니다.",
    strengths: "공감 능력이 뛰어나고, 협력적이며, 팀워크와 인간관계에서 중심 역할을 합니다.",
    weaknesses: "자신의 필요를 뒤로 미루는 경우가 있으며, 때때로 과도한 부담을 감수하기도 합니다.",
    behavior: "사람들을 돕고 지원하는 역할을 자연스럽게 맡으며, 팀의 안정과 조화를 중시합니다.",
    emoji: "🚒",
    bgColor: "from-red-900/30 to-orange-900/30",
    iconBg: "bg-red-500",
    textColor: "text-red-400",
    accentColor: "text-red-300"
  },
  "트럭": {
    title: "트럭 – 강인·실용·노동 (현실적/노력가형)",
    keywords: "강인, 실용, 노력, 현실적, 꾸준",
    traits: "목표 달성을 위해 묵묵히 노력하며, 현실적이고 실용적인 접근을 선호합니다. 일 처리에 있어 꾸준함이 특징입니다.",
    strengths: "인내심과 끈기가 강하며, 어려운 상황에서도 목표를 끝까지 완수합니다.",
    weaknesses: "변화나 새로운 시도에는 신중하고 보수적일 수 있습니다.",
    behavior: "실질적 문제 해결과 효율성을 중시하며, 꾸준히 성과를 내는 타입입니다.",
    emoji: "🚚",
    bgColor: "from-yellow-900/30 to-orange-900/30",
    iconBg: "bg-yellow-600",
    textColor: "text-yellow-400",
    accentColor: "text-yellow-300"
  }
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // 페이지 가시성 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const mainElement = document.querySelector('main');
    if (mainElement) {
      observer.observe(mainElement);
    }

    return () => observer.disconnect();
  }, []);

  // 페이지 로드 시 즉시 비디오 재생 시도
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.src = "/video/main.mp4";
        await video.load();
        await video.play();
      } catch (error) {
        console.warn('Initial video autoplay failed:', error);
      }
    };

    playVideo();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    const playVideo = async () => {
      try {
        video.src = "/video/main.mp4";
        await video.load();
        await video.play();
      } catch (error) {
        console.warn('Video autoplay failed:', error);
        // 사용자 상호작용 후 재생을 시도
        const handleUserInteraction = async () => {
          try {
            await video.play();
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
          } catch (err) {
            console.warn('Video play failed after user interaction:', err);
          }
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
      }
    };

    playVideo();
  }, [isVisible]);

	const {handleNavigate} = useNavigationWithTransition()
	const {username} = useUserStore()
	const handleStart = () =>{
		if(username){
			handleNavigate("/question")
		}
		else {
			handleNavigate("/login")
		}
	}
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <div className="relative w-screen h-screen overflow-hidden">
        {/* 비디오 배경 */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
          >
            <source src={"/video/main.mp4"} type="video/mp4" />
          </video>
        </div>
        {/* 메인 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/70 w-full">
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">

            {/* mainText.svg */}
            <div className="relative w-full max-w-4xl mx-auto">
              <Image
                src="/mainText.svg"
                alt="당신에게 맞는 성격을 찾아보세요!"
                width={829}
                height={190}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* 시작 버튼 */}
            <div className="pt-4 sm:pt-8">
              <Button
                onClick={handleStart}
                variant="default"
                size="lg"
                className="bg-white text-primary hover:bg-primary hover:text-white text-xl sm:text-2xl px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                시작
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 차량 성격 유형 설명 섹션 */}
      <div className="w-full bg-[#121212] text-white flex flex-col items-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-8">차량 성격 유형 설명</h2>
        <p className="text-gray-300 mb-12 max-w-2xl text-center">
          각 차량 유형은 특정 성격 특성을 상징합니다. 아래에서 각 유형의 특징을 확인해보세요.
        </p>

        {/* 차량 유형 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12 max-w-4xl w-full">
          {Object.entries(personalityTypes).map(([key, car]) => (
            <div
              key={key}
              className={`bg-gradient-to-r ${car.bgColor} rounded-2xl p-6 backdrop-blur`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                <div className={`${car.iconBg} rounded-full p-4 mb-4 md:mb-0 md:mr-6`}>
                  <span className="text-5xl">{car.emoji}</span>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${car.textColor}`}>{key}</h3>
                  <p className="text-xl mt-1">{car.title.split('–')[1].trim()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <p className={`font-medium ${car.accentColor} mb-2`}>대표 키워드</p>
                  <p className="text-gray-100">{car.keywords}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <p className={`font-medium ${car.accentColor} mb-2`}>특징</p>
                  <p className="text-gray-100">{car.traits}</p>
                </div>
                
                <div className="bg-green-900/20 backdrop-blur rounded-xl p-4">
                  <p className="font-medium text-green-400 mb-2">장점</p>
                  <p className="text-gray-100">{car.strengths}</p>
                </div>
                
                <div className="bg-red-900/20 backdrop-blur rounded-xl p-4">
                  <p className="font-medium text-red-400 mb-2">단점</p>
                  <p className="text-gray-100">{car.weaknesses}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4">
                <p className={`font-medium ${car.accentColor} mb-2`}>행동 경향</p>
                <p className="text-gray-100">{car.behavior}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
