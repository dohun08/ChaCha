'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { useState } from 'react';

interface ProvidersProps {
	children: React.ReactNode;
	dehydratedState?: DehydratedState;
}

export default function Providers({ children, dehydratedState }: ProvidersProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60,
						refetchOnWindowFocus: false,
					},
				},
			})
	);
	
	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydratedState}>
				{children}
			</HydrationBoundary>
		</QueryClientProvider>
	);
}