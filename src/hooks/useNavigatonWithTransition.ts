import {useEffect} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {useNavigationTransitionStore} from "@/store/useNavigationTransition";

export default function useNavigationWithTransition() {
  const navigate = useRouter();
  const location = usePathname();
  const {showTravel, setShowTravel} = useNavigationTransitionStore();
  
  useEffect(() => {
    if (showTravel) {
      const timer = setTimeout(() => setShowTravel(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [showTravel, setShowTravel]);

  const handleNavigate = (path: string) => {
    setShowTravel(true);
    setTimeout(() => {
      navigate.push(path);
      setShowTravel(false);
    }, 1200);
  };

  return {
    showTravel,
    handleNavigate,
    location
  };
}
