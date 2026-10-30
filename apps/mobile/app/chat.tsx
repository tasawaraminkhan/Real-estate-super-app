import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";

type Msg = { id: string; body: string; me: boolean };

function maskPhones(body: string) {
  return body.replace(/(\+92|0)?3\d{2}[\s-]?\d{7}/g, "+92***");
}

export default function ChatScreen() {
  const { title } = useLocalSearchParams<{ propertyId: string; title: string }>();
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", body: "Hello — interested in this property.", me: true },
    { id: "2", body: "Hi, happy to help. When would you like to visit?", me: false },
  ]);

  function send() {
    const body = text.trim();
    if (!body) return;
    const masked = maskPhones(body);
    setMsgs((m) => [...m, { id: String(Date.now()), body: masked, me: true }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: String(Date.now() + 1), body: "Thank you. We can schedule a visit this weekend.", me: false },
      ]);
    }, 700);
  }

  return (
    <Screen padded={false} edges={["top", "bottom"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={s.back}>←</Text>
        </Pressable>
        <Text style={s.hTitle} numberOfLines={1}>
          {title || "Chat"}
        </Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        <FlatList
          data={msgs}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: space.lg, gap: 8 }}
          renderItem={({ item }) => (
            <View style={[s.bubble, item.me ? s.me : s.them]}>
              <Text style={[s.bubbleText, item.me && { color: "#fff" }]}>{item.body}</Text>
            </View>
          )}
        />
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable style={s.send} onPress={send}>
            <Text style={s.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: space.lg,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  back: { fontSize: 22, color: colors.primary, fontWeight: "600" },
  hTitle: { flex: 1, fontWeight: "700", color: colors.text },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 14 },
  me: { alignSelf: "flex-end", backgroundColor: colors.primary },
  them: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bubbleText: { color: colors.text, fontSize: 15, lineHeight: 20 },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
  },
  send: { backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "700" },
});
