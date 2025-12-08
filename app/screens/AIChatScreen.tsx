// AIChatScreen.tsx
import React, { useRef, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    FlatList,
    NativeSyntheticEvent,
    TextInputSubmitEditingEventData
} from "react-native";
import Constants from "expo-constants";
import * as Speech from "expo-speech";

const OPENAI_KEY = Constants?.expoConfig?.extra?.OPENAI_API_KEY || "";

type ChatMessage = { id: number; role: "user" | "assistant"; content: string };

export default function AIChatScreen() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: Date.now(), role: "assistant", content: "Merhaba! Nasıl yardımcı olabilirim?" }
    ]);
    const [loading, setLoading] = useState(false);

    const flatRef = useRef<FlatList<ChatMessage>>(null);

    const scrollToEnd = () => {
        setTimeout(() => {
            flatRef.current?.scrollToEnd({ animated: true });
        }, 50);
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg: ChatMessage = { id: Date.now(), role: "user", content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        scrollToEnd();
        setLoading(true);

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Sen bir fitness ve beslenme koçusun." },
                        { role: "user", content: text }
                    ],
                    max_tokens: 400
                })
            });

            const json = await res.json();
            const aiText = json?.choices?.[0]?.message?.content || "Cevap alınamadı.";

            const botMsg: ChatMessage = { id: Date.now() + 1, role: "assistant", content: aiText };
            setMessages(prev => [...prev, botMsg]);
            try { Speech.speak(aiText, { language: "tr-TR" }); } catch {}
        } catch {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 2, role: "assistant", content: "Sunucu hatası. Tekrar dene." }
            ]);
        } finally {
            setLoading(false);
            scrollToEnd();
        }
    };

    const renderItem = ({ item }: { item: ChatMessage }) => (
        <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, item.role === "user" ? styles.userText : styles.aiText]}>
                {item.content}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>AI Koç</Text>
                </View>

                <FlatList
                    ref={flatRef}
                    data={messages}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />

                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mesaj yaz..."
                        placeholderTextColor="#aaa"
                        value={input}
                        onChangeText={setInput}
                        multiline
                        onSubmitEditing={(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                            handleSend();
                        }}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
                        <Text style={styles.sendBtnText}>{loading ? "..." : "Gönder"}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f7f9fc" },
    header: { height: 60, justifyContent: "center", paddingHorizontal: 16, borderBottomWidth: 1, borderColor: "#e6e6e6" },
    headerText: { fontSize: 22, fontWeight: "700", color: "#1e1e2f" },
    listContent: { padding: 16, paddingBottom: 10 },
    bubble: { padding: 12, marginVertical: 6, maxWidth: "80%", borderRadius: 18, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    userBubble: { backgroundColor: "#1e88ff", alignSelf: "flex-end", borderBottomRightRadius: 6 },
    aiBubble: { backgroundColor: "#fff", alignSelf: "flex-start", borderBottomLeftRadius: 6 },
    messageText: { fontSize: 16 },
    userText: { color: "#fff" },
    aiText: { color: "#1e1e2f" },
    inputArea: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#fff" },
    input: { flex: 1, backgroundColor: "#f1f2f6", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 24, maxHeight: 100, fontSize: 16 },
    sendBtn: { marginLeft: 10, backgroundColor: "#1e88ff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24 },
    sendBtnText: { color: "#fff", fontWeight: "600" }
});
