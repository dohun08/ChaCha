import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";

// ✅ 응답 제네릭 타입
export interface ApiResponse<T=any> {
	data: T;
	message?: string;
	status?: number;
}

// ✅ Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
	baseURL:"/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// ✅ 요청 인터셉터
axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// 클라이언트 환경에서만 localStorage 접근
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("access_token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);


export default axiosInstance;