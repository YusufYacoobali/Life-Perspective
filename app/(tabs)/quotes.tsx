import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { QUOTES, Quote, getDailyQuote } from '../../src/lib/quotes';

export default function QuotesScreen() {
  const { colors, isDark } = useTheme();
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const dailyIndex = QUOTES.indexOf(getDailyQuote());

  const gradientColors: [string, string, string] = isDark
    ? ['#07080A', '#15100E', '#07080A']
    : ['#F7F3EA', '#FFF6EF', '#F7F3EA'];
  const panelBg = isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.68)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,17,20,0.09)';
  const heroBg = isDark ? 'rgba(255,138,71,0.12)' : 'rgba(180,95,42,0.12)';
  const heroBorder = isDark ? 'rgba(255,138,71,0.38)' : 'rgba(180,95,42,0.32)';

  const toggleSave = (i: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const renderItem = ({ item, index }: { item: Quote; index: number }) => {
    const isDaily = index === dailyIndex;
    const isSaved = saved.has(index);
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: isDaily ? heroBg : panelBg, borderColor: isDaily ? heroBorder : panelBorder },
        ]}
      >
        <View style={styles.cardTop}>
          <Text style={[styles.badge, { color: isDaily ? colors.accentWarm : colors.textTertiary }]}>
            {isDaily ? 'TODAY' : `#${String(index + 1).padStart(2, '0')}`}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleSave(index)} hitSlop={8}>
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={18}
                color={isSaved ? colors.accentWarm : colors.textTertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Share.share({ message: `"${item.text}" - ${item.author}` })}
              hitSlop={8}
            >
              <Ionicons name="share-outline" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.quoteText, { color: colors.text }]}>{item.text}</Text>
        <Text style={[styles.author, { color: colors.textSecondary }]}>{item.author}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={QUOTES}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[styles.kicker, { color: colors.accentWarm }]}>REFLECTIONS</Text>
              <Text style={[styles.title, { color: colors.text }]}>A sharper sentence for the day.</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Save the lines that make you spend the next hour better.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  list: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 88, gap: 10 },
  header: { gap: 7, marginBottom: 8 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 2.4 },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '200' },
  subtitle: { fontSize: 14, lineHeight: 21 },
  card: { borderRadius: 8, borderWidth: 1, padding: 18, gap: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  quoteText: { fontSize: 18, lineHeight: 27, fontWeight: '300' },
  author: { fontSize: 12, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' },
  actions: { flexDirection: 'row', gap: 14 },
});
