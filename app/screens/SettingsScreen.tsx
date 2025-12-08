// app/screens/Settings.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        Alert.alert("Çıkış Yap", "Hesabınızdan çıkış yapmak istediğinize emin misiniz?", [
            { text: "İptal", style: "cancel" },
            { text: "Çıkış Yap", style: "destructive", onPress: () => console.log("Çıkış yapıldı") },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ayarlar</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Görünüm</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Koyu Mod</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bildirimler</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Bildirimleri Aç</Text>
                    <Switch value={notifications} onValueChange={setNotifications} />
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f7f9fc" },
    header: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#1e1e2f" },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#333" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
    label: { fontSize: 16, color: "#555" },
    logoutButton: {
        backgroundColor: "#ff5252",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
