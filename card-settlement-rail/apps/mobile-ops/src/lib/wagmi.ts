import "@walletconnect/react-native-compat";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "viem/chains";
import { walletConnect } from "@wagmi/connectors";

const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "00000000000000000000000000000000";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "Card Settlement Ops",
        description: "Operations console for Card Settlement Rail",
        url: "https://card-settlement-ops.invalid",
        icons: ["https://card-settlement-ops.invalid/icon.png"],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [baseSepolia.id]: http(
      process.env.EXPO_PUBLIC_BASE_SEPOLIA_RPC_URL || baseSepolia.rpcUrls.default.http[0],
    ),
  },
});

export const chain = baseSepolia;
