import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/theme';
import { QUOTES, Quote, getDailyQuote } from '../../src/lib/quotes';

const SAVED_QUOTES_KEY = '@life_perspective_saved_quotes';

type QuoteListItem = {
  quote: Quote;
  originalIndex: number;
};

export default function QuotesScreen() {
  const { colors, isDark } = useTheme();
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const dailyIndex = QUOTES.indexOf(getDailyQuote());

  useEffect(() => {
    AsyncStorage.getItem(SAVED_QUOTES_KEY)
      .then((raw) => {
        if (!raw) return;
        const indexes = JSON.parse(raw) as number[];
        setSaved(new Set(indexes.filter((index) => Number.isInteger(index))));
      })
      .catch(() => {
        // Saved quotes are a convenience; ignore storage misses.
      });
  }, []);

  const quoteItems = useMemo<QuoteListItem[]>(() => {
    return QUOTES.map((quote, originalIndex) => ({ quote, originalIndex })).sort((a, b) => {
      const aSaved = saved.has(a.originalIndex);
      const bSaved = saved.has(b.originalIndex);
      if (aSaved !== bSaved) return aSaved ? -1 : 1;
      return a.originalIndex - b.originalIndex;
    });
  }, [saved]);

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
      AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(Array.from(next))).catch(() => {
        // Non-critical; the current session still updates immediately.
      });
      return next;
    });
  };

  const renderItem = ({ item }: { item: QuoteListItem }) => {
    const { quote, originalIndex } = item;
    const isDaily = originalIndex === dailyIndex;
    const isSaved = saved.has(originalIndex);
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: isDaily ? heroBg : panelBg, borderColor: isDaily ? heroBorder : panelBorder },
        ]}
      >
        <View style={styles.cardTop}>
          <Text style={[styles.badge, { color: isDaily ? colors.accentWarm : colors.textTertiary }]}>
            {isSaved ? 'PINNED' : isDaily ? 'TODAY' : `#${String(originalIndex + 1).padStart(2, '0')}`}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleSave(originalIndex)} hitSlop={8}>
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={18}
                color={isSaved ? colors.accentWarm : colors.textTertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Share.share({ message: `"${quote.text}" - ${quote.author}` })}
              hitSlop={8}
            >
              <Ionicons name="share-outline" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.quoteText, { color: colors.text }]}>{quote.text}</Text>
        <Text style={[styles.author, { color: colors.textSecondary }]}>{quote.author}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={quoteItems}
          keyExtractor={(item) => String(item.originalIndex)}
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
