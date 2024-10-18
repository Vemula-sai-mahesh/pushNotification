import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useEffect } from "react";
import { usePushNotifications } from "./usePushNotifications";
import * as Notifications from "expo-notifications";

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);

  useEffect(() => {
    if (expoPushToken) {
      sendPushTokenToServer(expoPushToken);
    }
  }, [expoPushToken]);

  const sendPushTokenToServer = async (token: Notifications.ExpoPushToken) => {
    try {
      const response = await fetch("http://192.168.2.112:8006/api/users/1", {
        method: "PUT",
        headers: {
          accept: "*/*",
          "X-PrivateTenant": "spandana",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJST0xFIjoiQURNSU4iLCJURU5BTlQiOiJwdWJsaWMiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcyOTIzNDg2MCwiZXhwIjoxNzI5MjM4NDYwfQ.a8aYhQ-FFATZLiXyo3ciqihJuKpvyEkwx1--4PSXnJg",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          pushToken: token.data, // The push token
        }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Token sent successfully:", jsonResponse);
      } else {
        console.log("Failed to send token:", response.status);
      }
    } catch (error) {
      console.error("Error while sending token:", error);
      Alert.alert("Error", "Failed to send the token to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Token: {expoPushToken?.data ?? ""}</Text>
      <Text>Notification: {data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
