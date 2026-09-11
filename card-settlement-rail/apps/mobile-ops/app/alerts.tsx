import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AlertsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.subtitle}>Operational exceptions requiring attention.</Text>
      <View style={styles.empty}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.emptyTitle}>No active alerts</Text>
        <Text style={styles.muted}>Settlement, reconciliation, and risk events will appear here when delivered by the API.</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { padding: 20, gap: 14, backgroundColor: "#F7F8FA", minHeight: "100%" }, title: { fontSize: 28, fontWeight: "800", color: "#101828" }, subtitle: { color: "#667085" }, empty: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, gap: 8 }, icon: { fontSize: 28, color: "#12B76A" }, emptyTitle: { fontWeight: "700", fontSize: 17, color: "#101828" }, muted: { color: "#667085", lineHeight: 20 } });
