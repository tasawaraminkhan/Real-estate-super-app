import { Alert, Linking } from "react-native";

/** Demo-safe contact actions. Production should use masked/proxy numbers from API. */
export function openWhatsApp(phoneE164: string, message?: string) {
  const digits = phoneE164.replace(/\D/g, "");
  // Reject known placeholder / invalid demo numbers
  if (
    !digits ||
    digits.endsWith("1234567") ||
    digits.endsWith("123456789") ||
    digits.includes("3001234567")
  ) {
    Alert.alert(
      "Demo contact",
      "This is a sample listing. In production, WhatsApp opens a verified seller number (masked for privacy).",
      [{ text: "OK" }],
    );
    return;
  }
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  Linking.openURL(`https://wa.me/${digits}${text}`).catch(() => {
    Alert.alert("WhatsApp", "Could not open WhatsApp on this device.");
  });
}

export function openCall(phoneE164: string) {
  const digits = phoneE164.replace(/\D/g, "");
  if (!digits || digits.endsWith("1234567") || digits.includes("3001234567")) {
    Alert.alert(
      "Masked call",
      "In production a temporary proxy number is issued so the seller’s real number stays private.",
      [{ text: "OK" }],
    );
    return;
  }
  Linking.openURL(`tel:+${digits}`).catch(() => {
    Alert.alert("Call", "Could not start the call.");
  });
}
