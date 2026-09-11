import { Link } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSettlements } from "../../src/hooks/use-settlements";

export default function SettlementsScreen() {
  const { data, isLoading, isError, refetch } = useSettlements();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Settlement lifecycle and merchant disbursements.</Text>
      {isLoading && <ActivityIndicator />}
      {isError && <Pressable onPress={() => refetch()}><Text style={styles.error}>Unable to load settlements. Tap to retry.</Text></Pressable>}
      {!isLoading && !isError && (data?.length ? data.map((item) => (
        <Link key={item.id} href={`/settlements/${item.id}`} asChild>
          <Pressable style={styles.row}>
            <View style={styles.grow}>
              <Text style={styles.reference}>{item.settlementReference}</Text>
              <Text style={styles.muted}>{item.currency} · {item.status}</Text>
            </View>
            <Text style={styles.amount}>{item.netAmount}</Text>
          </Pressable>
        </Link>
      )) : <Text style={styles.muted}>No settlements returned by the API.</Text>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12, backgroundColor: "#F7F8FA", minHeight: "100%" },
  subtitle: { color: "#667085", marginBottom: 8 },
  row: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  grow: { flex: 1, gap: 4 },
  reference: { fontWeight: "700", color: "#101828" },
  muted: { color: "#667085", fontSize: 13 },
  amount: { fontWeight: "800", color: "#101828" },
  error: { color: "#B42318", padding: 12, backgroundColor: "#FEF3F2", borderRadius: 10 },
});
