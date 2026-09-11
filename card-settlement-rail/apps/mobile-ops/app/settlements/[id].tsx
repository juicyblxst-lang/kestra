import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSettlement } from "../../src/hooks/use-settlements";

export default function SettlementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = useSettlement(id);
  if (isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (isError || !data) return <View style={styles.center}><Text style={styles.error}>Settlement could not be loaded.</Text></View>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.reference}>{data.settlementReference}</Text>
      <View style={styles.hero}><Text style={styles.label}>NET SETTLEMENT</Text><Text style={styles.amount}>{data.netAmount} {data.currency}</Text><Text style={styles.status}>{data.status.toUpperCase()}</Text></View>
      <View style={styles.card}>
        <Row label="Settlement ID" value={data.id} />
        <Row label="Batch ID" value={data.batchId} />
        <Row label="Merchant ID" value={data.merchantId} />
        <Row label="Gross amount" value={`${data.amount} ${data.currency}`} />
        <Row label="Fees" value={`${data.fees} ${data.currency}`} />
        <Row label="Created" value={new Date(data.createdAt).toLocaleString()} />
        <Row label="Settled" value={data.settledAt ? new Date(data.settledAt).toLocaleString() : "—"} />
      </View>
    </ScrollView>
  );
}
function Row({ label, value }: { label: string; value: string }) { return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, backgroundColor: "#F7F8FA", minHeight: "100%" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  reference: { fontSize: 24, fontWeight: "800", color: "#101828" },
  hero: { backgroundColor: "#101828", borderRadius: 18, padding: 20, gap: 8 },
  label: { color: "#667085", fontSize: 11, fontWeight: "700", letterSpacing: 0.7 },
  amount: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  status: { color: "#D0D5DD", fontSize: 12, fontWeight: "700" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, gap: 16 },
  row: { gap: 4 },
  value: { color: "#101828", fontWeight: "600" },
  error: { color: "#B42318" },
});
