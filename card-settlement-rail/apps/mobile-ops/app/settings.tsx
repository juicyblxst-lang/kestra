import { useAccount, useChainId } from "wagmi";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { authenticateSensitiveOperation, isBiometricAvailable } from "../src/lib/biometric";

export default function SettingsScreen() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [busy, setBusy] = useState(false);
  const authorize = async () => {
    setBusy(true);
    try {
      const available = await isBiometricAvailable();
      if (!available) return Alert.alert("Biometrics unavailable", "No enrolled Face ID, Touch ID, or device biometric is available.");
      const ok = await authenticateSensitiveOperation("Authorize Card Settlement Ops settings");
      Alert.alert(ok ? "Authorized" : "Not authorized", ok ? "Biometric verification succeeded." : "Verification was cancelled or failed.");
    } finally { setBusy(false); }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}><Text style={styles.label}>CONNECTED WALLET</Text><Text style={styles.value}>{address ? `${address.slice(0, 10)}…${address.slice(-8)}` : "Not connected"}</Text><Text style={styles.muted}>Chain ID: {chainId || "—"}</Text></View>
      <View style={styles.card}><Text style={styles.label}>AUTHORIZATION</Text><Text style={styles.value}>Biometric approval</Text><Text style={styles.muted}>Use Face ID, Touch ID, or device biometrics before sensitive operations.</Text><Pressable style={styles.button} onPress={authorize} disabled={busy}><Text style={styles.buttonText}>{busy ? "Verifying…" : "Test biometric authorization"}</Text></Pressable></View>
      <View style={styles.card}><Text style={styles.label}>ENVIRONMENT</Text><Text style={styles.value}>Base Sepolia</Text><Text style={styles.muted}>Production credentials and production chains are intentionally not configured in Round 1.</Text></View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { padding: 20, gap: 14, backgroundColor: "#F7F8FA", minHeight: "100%" }, title: { fontSize: 28, fontWeight: "800", color: "#101828" }, card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, gap: 7 }, label: { color: "#667085", fontSize: 11, fontWeight: "700", letterSpacing: 1 }, value: { color: "#101828", fontSize: 17, fontWeight: "700" }, muted: { color: "#667085", lineHeight: 20 }, button: { backgroundColor: "#101828", borderRadius: 10, padding: 13, alignItems: "center", marginTop: 8 }, buttonText: { color: "#FFFFFF", fontWeight: "700" } });
