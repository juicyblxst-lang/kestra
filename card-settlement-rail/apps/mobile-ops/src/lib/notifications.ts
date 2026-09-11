import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Round 1 deliberately does not register or request notification permissions.
  // This function is the integration boundary for the eventual device-registration flow.
  if (Constants.appOwnership === "expo" && Platform.OS === "android") {
    // Expo Go notification behavior varies by SDK/runtime; keep registration explicit later.
    return null;
  }
  void Notifications;
  return null;
}

export async function getNotificationPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
  return Notifications.getPermissionsAsync();
}
