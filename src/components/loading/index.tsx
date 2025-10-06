"use client";

import Image from "next/image";
import { useNavigationTransitionStore } from "@/store/useNavigationTransition";

export default function LoadingAnimation() {
	const { showTravel } = useNavigationTransitionStore();
	
	if (!showTravel) return null;
	
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[9999]">
			<Image
				src="/car.gif"
				alt="Loading Car Animation"
				width={200}
				height={200}
				priority
			/>
		</div>
	);
}