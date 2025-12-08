// MyWorkouts.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MyWorkouts() {

    // Kullanıcının kimliği Convex’ten çekilir
    const identity = useQuery(api.users.getIdentity);
    const workouts = useQuery(api.workouts.getWorkouts);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Antrenmanlarım</Text>

            <FlatList
                data={workouts ?? []}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.detail}>{item.detail}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        Henüz antrenman eklenmemiş.
                    </Text>
                }
            />
        </View>
    );
}
