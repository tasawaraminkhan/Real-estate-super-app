import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Msg = { id: string; body: string; me: boolean };

export default function ChatScreen() {
  const { title } = useLocalSearchParams<{ propertyId: string; title: string }>();
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", body: "Assalam o alaikum — is listing ke bare mein poochna tha.", me: true },
    { id: "2", body: "Walaikum assalam, ji boliye.", me: false },
  ]);

  function send() {
    const body = text.trim();
    if (!body) return;
    // mask phones client-side too
    const masked = body.replace(/(\+92|0)?3\d{2}[\s-]?\d{7}/g, "+92***");
    setMsgs((m) => [...m, { id: String(Date.now()), body: masked, me: true }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: String(Date.now() + 1), body: "Shukriya. Visit schedule karte hain?", me: false },
      ]);
    }, 800);
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </Pressable>
        <Text style={s.hTitle} numberOfLines={1}>
          {title || "Chat"}
        </Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={msgs}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
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
            placeholderTextColor="#4A5A55"
            onSubmitEditing={send}
          />
          <Pressable style={s.send} onPress={send}>
            <Text style={s.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15,28,25,0.1)",
  },
  back: { fontSize: 22, color: "#0D6B5F", fontWeight: "600" },
  hTitle: { flex: 1, fontWeight: "700", color: "#0F1C19" },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 14 },
  me: { alignSelf: "flex-end", backgroundColor: "#0D6B5F" },
  them: { alignSelf: "flex-start", backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(15,28,25,0.1)" },
  bubbleText: { color: "#0F1C19", fontSize: 15 },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(15,28,25,0.1)",
  },
  input: {
    flex: 1,
    backgroundColor: "#EEF1EC",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#0F1C19",
  },
  send: {
    backgroundColor: "#0D6B5F",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendText: { color: "#fff", fontWeight: "700" },
});
