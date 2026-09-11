import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ChargebacksScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chargebacks</Text>
      <Text style={styles.subtitle}>Monitor disputes and representment deadlines.</Text>
      <View style={styles.card}>
        <Text style={styles.metric}>0</Text>
        <Text style={styles.label}>OPEN CHARGEBACKS</Text>
      </View>
      <View style={styles.empty}><Text style={styles.emptyTitle}>No open chargebacks</Text><Text style={styles.muted}>The API will surface chargeback cases here when the dispute rail is active.</Text></View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { padding: 20, gap: 14, backgroundColor: "#F7F8FA", minHeight: "100%" }, title: { fontSize: 28, fontWeight: "800", color: "#101828" }, subtitle: { color: "#667085" }, card: { backgroundColor: "#101828", borderRadius: 16, padding: 20, gap: 6 }, metric: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" }, label: { color: "#98A2B3", fontSize: 11, fontWeight: "700", letterSpacing: 1 }, empty: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, gap: 6 }, emptyTitle: { fontWeight: "700", color: "#101828" }, muted: { color: "#667085", lineHeight: 20 } });
