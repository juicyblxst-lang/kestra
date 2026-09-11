import { Link, router } from "expo-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSettlements } from "../src/hooks/use-settlements";

export default function OperationsHome() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const settlements = useSettlements();
  const total = settlements.data?.length ?? 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CARD SETTLEMENT RAIL</Text>
          <Text style={styles.title}>Ops console</Text>
        </View>
        <View style={[styles.dot, { opacity: isConnected ? 1 : 0.35 }]} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>WALLET</Text>
        {isConnected ? (
          <>
            <Text style={styles.value}>{address?.slice(0, 8)}…{address?.slice(-6)}</Text>
            <Text style={styles.muted}>{chain?.name ?? "Unknown network"}</Text>
            <Pressable style={styles.secondaryButton} onPress={() => disconnect()}>
              <Text style={styles.secondaryText}>Disconnect</Text>
            </Pressable>
          </>
        ) : (
          connectors.slice(0, 1).map((connector) => (
            <Pressable key={connector.uid} style={styles.button} onPress={() => connect({ connector })} disabled={isPending}>
              <Text style={styles.buttonText}>{isPending ? "Connecting…" : "Connect wallet"}</Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.grid}>
        <Pressable style={styles.metric} onPress={() => router.push("/settlements")}>
          <Text style={styles.label}>SETTLEMENTS</Text>
          <Text style={styles.metricValue}>{settlements.isLoading ? "—" : total}</Text>
          <Text style={styles.muted}>View settlement rail</Text>
        </Pressable>
        <Link href="/chargebacks" asChild>
          <Pressable style={styles.metric}>
            <Text style={styles.label}>EXCEPTIONS</Text>
            <Text style={styles.metricValue}>0</Text>
            <Text style={styles.muted}>Chargebacks</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.links}>
        <Link href="/alerts" asChild><Pressable><Text style={styles.link}>Alerts →</Text></Pressable></Link>
        <Link href="/settings" asChild><Pressable><Text style={styles.link}>Settings →</Text></Pressable></Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, backgroundColor: "#F7F8FA", minHeight: "100%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8 },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.4, color: "#667085" },
  title: { fontSize: 30, fontWeight: "800", color: "#101828", marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#12B76A" },
  card: { backgroundColor: "#101828", borderRadius: 18, padding: 20, gap: 8 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: "#98A2B3" },
  value: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  muted: { color: "#667085", fontSize: 13 },
  button: { backgroundColor: "#FFFFFF", padding: 13, borderRadius: 10, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#101828", fontWeight: "700" },
  secondaryButton: { borderWidth: 1, borderColor: "#475467", padding: 11, borderRadius: 10, alignItems: "center", marginTop: 8 },
  secondaryText: { color: "#FFFFFF", fontWeight: "700" },
  grid: { flexDirection: "row", gap: 12 },
  metric: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, gap: 6, minHeight: 120 },
  metricValue: { fontSize: 30, fontWeight: "800", color: "#101828" },
  links: { gap: 18, paddingVertical: 8 },
  link: { color: "#344054", fontSize: 16, fontWeight: "600" },
});
