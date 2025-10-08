export type CarType = '🏎️' | '🚘' | '🚓' | '🚒' | '🚛';

/**
 * 차량 이모지를 숫자 코드로 변환
 * 🏎️ = 1, 🚘 = 2, 🚓 = 3, 🚒 = 4, 🚛 = 5
 */
export const getCarCode = (car: CarType): number => {
	const map: Record<CarType, number> = {
		'🏎️': 1,
		'🚘': 2,
		'🚓': 3,
		'🚒': 4,
		'🚛': 5,
	};
	
	return map[car];
};

/**
 * 숫자 코드를 다시 차량 이모지로 변환
 * 1 = 🏎️, 2 = 🚘, 3 = 🚓, 4 = 🚒, 5 = 🚛
 */
export const getCarEmoji = (code: number): CarType | null => {
	const reverseMap: Record<number, CarType> = {
		1: '🏎️',
		2: '🚘',
		3: '🚓',
		4: '🚒',
		5: '🚛',
	};
	
	return reverseMap[code] || null;
};

export const getCarNumberByName = (carName : string) =>{
	const reverseMap: Record<string, string> = {
		"스포츠카(모험가형)": 'sportCar',
		"전기차(미래형)": 'future',
		"경찰차(보호자형)": 'police',
		"소방차(봉사형)": 'fire',
		"트럭(노력가형)": 'truck',
	};
	
	return reverseMap[carName] || null;
}