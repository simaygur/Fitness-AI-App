import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TextInput,
    LayoutAnimation,
    UIManager,
    Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width } = Dimensions.get("window");

const MOTIVATIONS = [
    "Bugün kendine yatırım yap!",
    "Her tekrar seni güçlendirir.",
    "Hedeflerine bir adım daha yaklaştın!",
    "Sürekli küçük adımlar büyük fark yaratır."
];

const MINI_CHALLENGES = [
    "Bugün 10 dakika yürüyüş yap",
    "5 dakikalık esneme yap",
    "Sabah kahvaltında protein ekle",
    "10 squats yap"
];

const TRAINING_CARDS = [
    { id: 1, title: "Biceps Curl", info: "Kol kaslarını çalıştırır.", detail: "Biceps Curl: 3 set x 12 tekrar, dambıl ile yap.", category: "Kol" },
    { id: 2, title: "Squat", info: "Bacak ve kalça kasları.", detail: "Squat: 4 set x 15 tekrar, vücut ağırlığı ile yap.", category: "Bacak" },
    { id: 3, title: "Plank", info: "Karın kaslarını çalıştırır.", detail: "Plank: 3 set x 60 saniye, düz sırt pozisyonunda dur.", category: "Sırt" },
    { id: 4, title: "Shoulder Press", info: "Omuz kaslarını çalıştırır.", detail: "Shoulder Press: 3 set x 12 tekrar, dambıl ile yap.", category: "Omuz" },
    { id: 5, title: "Lunge", info: "Bacak kaslarını çalıştırır.", detail: "Lunge: 3 set x 12 tekrar, her bacak için.", category: "Bacak" },
];

const FOOD_CARDS = [
    { id: 1, title: "Smoothie", info: "Enerji dolu sabah.", detail: "Smoothie: 1 muz + 1/2 su bardağı yaban mersini + 1 su bardağı süt + blenderda karıştır.", category: "Tatlı" },
    { id: 2, title: "Salata", info: "Vitamin deposu.", detail: "Salata: Marul + Domates + Salatalık + Zeytinyağı + Limon.", category: "Tuzlu" },
    { id: 3, title: "Protein Bar", info: "Hızlı enerji kaynağı.", detail: "Protein Bar: 50 gr yulaf + 2 yemek kaşığı fıstık ezmesi + 1 kaşık protein tozu.", category: "Tatlı" },
    { id: 4, title: "Tavuklu Sandviç", info: "Hafif ve protein dolu.", detail: "Tavuklu Sandviç: Tam buğday ekmeği + 100gr tavuk + Marul + Domates.", category: "Tuzlu" },
];

const TRAINING_CATEGORIES = ["Bacak", "Kol", "Sırt", "Omuz"];
const FOOD_CATEGORIES = ["Tuzlu", "Tatlı"];

export default function HomePage() {
    const [motivationIndex, setMotivationIndex] = useState(0);
    const [expandedCards, setExpandedCards] = useState<{[key:number]: boolean}>({});
    const [selectedTrainingCategory, setSelectedTrainingCategory] = useState<string>("Bacak");
    const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>("Tuzlu");
    const [waterCount, setWaterCount] = useState(0);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [completedChallenges, setCompletedChallenges] = useState<{[key:number]: boolean}>({});
    const [calorieInput, setCalorieInput] = useState("");
    const [targetCalorie, setTargetCalorie] = useState("2000"); // Hedef kalori

    const [weekCalories, setWeekCalories] = useState<{[day: string]: number}>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setMotivationIndex(prev => (prev + 1) % MOTIVATIONS.length);
            setChallengeIndex(prev => (prev + 1) % MINI_CHALLENGES.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => { loadCalories(); }, []);

    const todayKey = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;

    const addCalorie = () => {
        const value = parseInt(calorieInput);
        if (!isNaN(value)) {
            setWeekCalories(prev => {
                const updated = { ...prev };
                updated[todayKey] = (updated[todayKey] || 0) + value;
                saveCalories(updated);
                return updated;
            });
            setCalorieInput("");
        }
    };

    const loadCalories = async () => {
        try {
            const stored = await AsyncStorage.getItem("weekCalories");
            if (stored) setWeekCalories(JSON.parse(stored));
            const storedTarget = await AsyncStorage.getItem("targetCalorie");
            if (storedTarget) setTargetCalorie(storedTarget);
        } catch(e) { console.log("Error loading calories", e); }
    };

    const saveCalories = async (newCalories: {[day: string]: number}) => {
        try { await AsyncStorage.setItem("weekCalories", JSON.stringify(newCalories)); }
        catch(e) { console.log("Error saving calories", e); }
    };

    const saveTarget = async (value: string) => {
        try { await AsyncStorage.setItem("targetCalorie", value); }
        catch(e) { console.log("Error saving target", e); }
    };

    // Son 7 gün bugünden başla
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        return { key, value: weekCalories[key] || 0 };
    });

    const last7DayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    const handleCardPress = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const increaseWater = () => setWaterCount(prev => prev + 1);
    const decreaseWater = () => setWaterCount(prev => (prev > 0 ? prev - 1 : 0));

    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 20, backgroundColor: "#f2f6f8" }}>

            {/* Motivasyon Kutucuğu */}
            <View style={styles.motivationBubble}>
                <Text style={styles.motivationText}>{MOTIVATIONS[motivationIndex]}</Text>

                {/* Mini Challenge */}
                <View style={{ marginTop: 15, alignItems: "center" }}>
                    <Text style={{
                        fontSize: 16,
                        color: completedChallenges[challengeIndex] ? "#95a5a6" : "#2c3e50",
                        textDecorationLine: completedChallenges[challengeIndex] ? "line-through" : "none",
                        textAlign: "center"
                    }}>
                        {MINI_CHALLENGES[challengeIndex]}
                    </Text>
                    {!completedChallenges[challengeIndex] &&
                        <TouchableOpacity
                            onPress={() => setCompletedChallenges(prev => ({ ...prev, [challengeIndex]: true }))}
                            style={{ marginTop: 10, backgroundColor: "#16a085", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Tamamladım</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>

            {/* Kalori Girişi */}
            <View style={[styles.card, { backgroundColor: "#e67e22" }]}>
                <Text style={[styles.cardTitle, { color: "#fff" }]}>Kalori Takibi</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Bugünkü kaloriyi gir"
                    keyboardType="numeric"
                    value={calorieInput}
                    onChangeText={setCalorieInput}
                    placeholderTextColor="#fff"
                />
                <TouchableOpacity onPress={addCalorie} style={styles.addButton}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Ekle</Text>
                </TouchableOpacity>

                <TextInput
                    style={[styles.input, { marginTop: 10 }]}
                    placeholder="Hedef Kalori"
                    keyboardType="numeric"
                    value={targetCalorie}
                    onChangeText={(v) => { setTargetCalorie(v); saveTarget(v); }}
                    placeholderTextColor="#fff"
                />

                {/* Haftalık Kalori Çubuğu */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, width: width - 80 }}>
                    {last7Days.map((day, i) => {
                        const maxCal = parseInt(targetCalorie) || 2000;
                        const barHeight = Math.min((day.value / maxCal) * 120, 120);
                        return (
                            <View key={day.key} style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 3 }}>{day.value}</Text>
                                <View style={{ width: 25, height: 120, justifyContent: 'flex-end', backgroundColor: '#ecf0f1', borderRadius: 6 }}>
                                    <View style={{ width: 25, height: barHeight, backgroundColor: '#2980b9', borderRadius: 6 }} />
                                </View>
                                <Text style={{ marginTop: 5, fontSize: 12, fontWeight: "bold" }}>{last7DayLabels[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Su İçme Kartı */}
            <View style={[styles.card, { backgroundColor: "#3498db" }]}>
                <Text style={[styles.cardTitle, { color: "#fff" }]}>Su İç</Text>
                <Text style={[styles.cardInfo, { color: "#ecf0f1", marginBottom: 10 }]}>Bugün {waterCount} bardak su içtiniz</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: 120 }}>
                    <TouchableOpacity onPress={decreaseWater} style={styles.waterButton}><Text style={styles.waterButtonText}>-</Text></TouchableOpacity>
                    <TouchableOpacity onPress={increaseWater} style={styles.waterButton}><Text style={styles.waterButtonText}>+</Text></TouchableOpacity>
                </View>
            </View>

            {/* Antrenmanlar */}
            <Text style={styles.sectionTitle}>Antrenmanlar</Text>
            <ScrollView horizontal style={{ paddingHorizontal: 10, marginBottom: 10 }} showsHorizontalScrollIndicator={false}>
                {TRAINING_CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryButton, selectedTrainingCategory === cat && styles.selectedCategory]}
                        onPress={() => setSelectedTrainingCategory(cat)}
                    >
                        <Text style={[styles.categoryText, selectedTrainingCategory === cat && { color: "#fff" }]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {TRAINING_CARDS.filter(c => c.category === selectedTrainingCategory).map(card => (
                <TouchableOpacity key={card.id} style={[styles.card, expandedCards[card.id] && styles.expandedCard]} onPress={() => handleCardPress(card.id)}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardInfo}>{card.info}</Text>
                    {expandedCards[card.id] && <Text style={styles.cardDetail}>{card.detail}</Text>}
                </TouchableOpacity>
            ))}

            {/* Tarifler */}
            <Text style={styles.sectionTitle}>Sağlıklı Tarifler</Text>
            <ScrollView horizontal style={{ paddingHorizontal: 10, marginBottom: 10 }} showsHorizontalScrollIndicator={false}>
                {FOOD_CATEGORIES.map(cat => (
                    <TouchableOpacity key={cat} style={[styles.categoryButton, selectedFoodCategory === cat && styles.selectedCategory]} onPress={() => setSelectedFoodCategory(cat)}>
                        <Text style={[styles.categoryText, selectedFoodCategory === cat && { color: "#fff" }]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {FOOD_CARDS.filter(c => c.category === selectedFoodCategory).map(card => (
                <TouchableOpacity key={100 + card.id} style={[styles.card, expandedCards[100 + card.id] && styles.expandedCard]} onPress={() => handleCardPress(100 + card.id)}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardInfo}>{card.info}</Text>
                    {expandedCards[100 + card.id] && <Text style={styles.cardDetail}>{card.detail}</Text>}
                </TouchableOpacity>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    motivationBubble: {
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 25,
        backgroundColor: "#a1c4fd",
        alignItems: "center",
        marginBottom: 25,
        width: '90%',
        height: 220,
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    motivationText: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#34495e" },
    sectionTitle: { fontSize: 22, fontWeight: "bold", marginLeft: 20, marginBottom: 12, color: "#2c3e50" },
    categoryButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, backgroundColor: "#ecf0f1", marginHorizontal: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
    selectedCategory: { backgroundColor: "#1abc9c" },
    categoryText: { fontSize: 15, fontWeight: "bold", color: "#2c3e50" },
    card: { marginHorizontal: 20, marginVertical: 10, paddingVertical: 25, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#ffffff", width: width - 40, minHeight: 140, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
    expandedCard: { minHeight: 280, justifyContent: "flex-start" },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: "#16a085", marginBottom: 6 },
    cardInfo: { fontSize: 15, color: "#7f8c8d", textAlign: "center" },
    cardDetail: { marginTop: 12, fontSize: 15, color: "#34495e", textAlign: "center" },
    input: { width: "60%", height: 40, borderColor: "#fff", borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginVertical: 10, color: "#fff" },
    addButton: { backgroundColor: "#d35400", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
    waterButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#2980b9", justifyContent: "center", alignItems: "center" },
    waterButtonText: { fontSize: 22, fontWeight: "bold", color: "#fff" }
});
