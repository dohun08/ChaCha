'use client';

import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ProvidersProps {
	children: ReactNode;
	dehydratedState?: unknown;
}

export default function Providers({ children, dehydratedState }: ProvidersProps) {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60, // 1분
				retry: 1,
			},
		},
	}));
	
	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedState}>
				{children}
			</Hydrate>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}