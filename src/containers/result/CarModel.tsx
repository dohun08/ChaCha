"use client"

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {Suspense, useEffect, useRef} from "react";
import { Group } from "three";
import {getCarNumberByName} from "@/utils/changeToCar";

export const carModel : Record<string, CarModel> = {
	"sportCar" : {
		name : "스포츠카",
		url : "/models/sportcar.glb",
		camera : [340, 260, 400],
		z : 60,
		x : 20,
		start : [0,0,400],
		scale : 1.5
	},
	"truck" : {
		name : "트럭",
		url : "/models/truck.glb",
		camera :  [50, 10, 50],
		z : 4,
		x : 20,
		start:[7, -20, 20],
		scale:10.5
		
	},
	"police" : {
		name : "경찰차",
		url : "/models/police.glb",
		camera : [20, 12, -10],
		z : 1.4,
		x : 20,
		scale:7,
		start:[-8, 0, 10]
	},
	"fire" : {
		name : "소방차",
		url : "/models/fire_truck.glb",
		camera : [-60, 20, -60],
		z : -8,
		x : 10,
		scale:2,
		start : [0, -10, 0]
	},
	"future" : {
		name : "미래차",
		url : "/models/tesla.glb",
		camera : [45, 9, 45],
		z : 4,
		x : 20,
		start:[2, -20, 10],
		scale:17
	}
}

interface CarModelProps {
	url: string;
	x : number;
	z : number;
	scale : number;
	start : [number, number, number];
}
interface CarModel{
	name : string;
	url : string;
	camera : [number, number, number];
	x : number,
	z : number,
	start : [number, number, number];
	scale  : number;
}

function CarModel({ url , x, z, scale, start}: CarModelProps) {
	const { scene } = useGLTF(url) as { scene: Group };
	const ref = useRef<Group>(null);
	const elapsedTime = useRef(0); // 누적 시간
	
	const wheels = [
		scene.getObjectByName("Wheel_FL"),
		scene.getObjectByName("Wheel_FR"),
		scene.getObjectByName("Wheel_RL"),
		scene.getObjectByName("Wheel_RR"),
	].filter(Boolean);
	
	useFrame((state, delta) => {
		if (elapsedTime.current < 8) {
			elapsedTime.current += delta;
			
			if (ref.current) {
				// 차 앞으로 이동
				ref.current.position.z -= delta * z;
				
				// 바퀴 회전
				wheels.forEach((wheel) => {
					wheel!.rotation.x -= delta * x;
				});
			}
		}
	});
	
	return <primitive ref={ref} object={scene} scale={scale} position={start} />;
}


export default function CarScene({carName}: {carName : string}) {
	console.log(getCarNumberByName(carName), carName)
	const model =  carModel[getCarNumberByName(carName) ?? ""]
	useEffect(() => {
		const audio = new Audio("/sound/fadeIn.m4a");
		audio.volume = 1; // 볼륨 조정
		audio.play().catch((err) => console.log("오디오 재생 실패:", err));
	}, []);
	return (
		<div className="w-full h-64">
			<Canvas camera={{ position: model.camera, fov: 60 }} gl={{ alpha: true }}>
				<ambientLight intensity={2} />
				<directionalLight position={[5, 5, 5]} intensity={10} color={0xffffff} />
				<Suspense fallback={null}>
					<CarModel scale={model.scale} start={model.start} url={model.url} x={model.x} z={model.z} />
				</Suspense>
			</Canvas>
		</div>
	);
}