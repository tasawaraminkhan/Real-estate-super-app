import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/phone" />
        <Stack.Screen name="(auth)/otp" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="detail" options={{ presentation: "card" }} />
        <Stack.Screen name="chat" options={{ presentation: "card" }} />
      </Stack>
    </>
  );
}
