import "../src/lib/wagmi";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../src/lib/wagmi";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 15_000, retry: 2 } },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="index" options={{ title: "Operations" }} />
          <Stack.Screen name="settlements/index" options={{ title: "Settlements" }} />
          <Stack.Screen name="settlements/[id]" options={{ title: "Settlement" }} />
          <Stack.Screen name="chargebacks/index" options={{ title: "Chargebacks" }} />
          <Stack.Screen name="alerts" options={{ title: "Alerts" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
