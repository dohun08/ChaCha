
"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/button';

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

  return (
      <main className="relative w-screen h-screen overflow-hidden">
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/70  w-full">
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
                variant="default" 
                size="lg"
                className="bg-white text-primary hover:bg-primary hover:text-white text-xl sm:text-2xl px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                시작
              </Button>
            </div>
          </div>
        </div>
      </main>
  );
}
