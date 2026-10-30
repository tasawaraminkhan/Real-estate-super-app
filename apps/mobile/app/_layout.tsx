import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/phone" />
          <Stack.Screen name="(auth)/otp" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="detail" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="favourites" />
          <Stack.Screen name="legal-check" />
          <Stack.Screen name="escrow" />
          <Stack.Screen name="materials" />
          <Stack.Screen name="invest" />
          <Stack.Screen name="labour" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
