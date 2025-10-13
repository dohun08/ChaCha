"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Group } from "three";
import { getCarNumberByName } from "@/utils/changeToCar";

export const carModel = {
	sportCar: {
		name: "스포츠카",
		url: "/models/sportcar.glb",
		camera: [340, 260, 400],
		z: 60,
		x: 20,
		start: [0, 0, 400],
		scale: 1.5,
	},
	truck: {
		name: "트럭",
		url: "/models/truck.glb",
		camera: [50, 10, 50],
		z: 4,
		x: 20,
		start: [7, -20, 20],
		scale: 10.5,
	},
	police: {
		name: "경찰차",
		url: "/models/police.glb",
		camera: [20, 12, -10],
		z: 1.4,
		x: 20,
		scale: 7,
		start: [-8, 0, 10],
	},
	fire: {
		name: "소방차",
		url: "/models/fire_truck.glb",
		camera: [-60, 20, -60],
		z: -8,
		x: 10,
		scale: 2,
		start: [0, -10, 0],
	},
	future: {
		name: "미래차",
		url: "/models/tesla.glb",
		camera: [45, 9, 45],
		z: 4,
		x: 20,
		start: [2, -20, 10],
		scale: 17,
	},
} as const;

interface CarModelProps {
	url: string;
	x: number;
	z: number;
	scale: number;
	start: [number, number, number];
}

function CarModel({ url, x, z, scale, start }: CarModelProps) {
	const { scene } = useGLTF(url) as { scene: Group };
	const ref = useRef<Group>(null);
	const elapsedTime = useRef(0);
	
	const wheels = [
		scene.getObjectByName("Wheel_FL"),
		scene.getObjectByName("Wheel_FR"),
		scene.getObjectByName("Wheel_RL"),
		scene.getObjectByName("Wheel_RR"),
	].filter(Boolean);
	
	useFrame((_, delta) => {
		if (elapsedTime.current < 8) {
			elapsedTime.current += delta;
			if (ref.current) {
				ref.current.position.z -= delta * z;
				wheels.forEach((wheel) => {
					wheel!.rotation.x -= delta * x;
				});
			}
		}
	});
	
	return <primitive ref={ref} object={scene} scale={scale} position={start} />;
}

Object.values(carModel).forEach((model) => {
	useGLTF.preload(model.url);
});

export default function CarScene({ carName }: { carName: string }) {
	const key = (getCarNumberByName(carName) ?? "sportCar") as keyof typeof carModel;
	const model = carModel[key];
	
	useEffect(() => {
		const audio = new Audio("/sound/fadeIn.m4a");
		audio.volume = 1;
		audio.play().catch((err) => console.log("오디오 재생 실패:", err));
	}, []);
	
	return (
		<div className="w-full h-64">
			<Canvas camera={{ position: model.camera, fov: 60 }} gl={{ alpha: true }}>
				<ambientLight intensity={2} />
				<directionalLight position={[5, 5, 5]} intensity={10} color={0xffffff} />
				<Suspense fallback={null}>
					<CarModel
						scale={model.scale}
						start={model.start as [number, number, number]}
						url={model.url}
						x={model.x}
						z={model.z}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}