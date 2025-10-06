"use client";

import React from "react";

interface QuestionCardProps {
	id: number;
	text: string;
	selected: number | null;
	onSelect: (id: number, value: number) => void;
	minText : string;
	maxText : string;
}

const options = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

export default function QuestionCard({ id, text, selected, onSelect, minText, maxText }: QuestionCardProps) {
	return (
		<div className="bg-white rounded-2xl gap-10 flex flex-col p-12 shadow-md my-8 w-full max-w-5xl mx-auto">
			<h2 className="text-[#3AD55F] font-bold text-lg mb-4">
				Q{id} {text}
			</h2>
			<div>
				<p className="text-xl border-1 w-max px-6 py-2 rounded-2xl border-black text-gray-600">{minText}</p>
			</div>
			<div className="flex justify-between items-center">
				{options.map((opt, i) => {
					const sizeClasses = [
						"w-16 h-16", // 제일 왼쪽 (크게)
						"w-12 h-12",
						"w-8 h-8", // 중앙 (작게)
						"w-12 h-12",
						"w-16 h-16", // 제일 오른쪽 (크게)
					];
					
					return (
						<label
							key={i}
							className="flex flex-col items-center cursor-pointer text-sm text-gray-600 transition-all"
						>
							<input
								type="radio"
								name={`q${id}`}
								value={i + 1}
								checked={selected === i + 1}
								onChange={() => onSelect(id, i + 1)}
								className={`cursor-pointer hover:scale-110 hover:bg-green-100 appearance-none border-2 border-green-500 rounded-full checked:bg-green-500 transition-all ${sizeClasses[i]}`}
							/>
							<span className="mt-2">{opt}</span>
						</label>
					);
				})}
			</div>
			<div className={"w-full flex justify-end"}>
				<p className="w-max px-6 py-2 rounded-2xl border-1 border-black text-xl text-gray-600">{maxText}</p>
			</div>
			
		</div>
	);
}