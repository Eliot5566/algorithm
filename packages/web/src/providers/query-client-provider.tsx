'use client';

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { ReactNode, useState } from 'react';

function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1
          }
        }
      })
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff'
        }
      }}
    >
      <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
    </ConfigProvider>
  );
}

export default QueryClientProvider;
