import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/theme';
import { QUOTES, Quote, getDailyQuote } from '../../src/lib/quotes';

export default function QuotesScreen() {
  const { colors, isDark } = useTheme();
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const dailyIndex = QUOTES.indexOf(getDailyQuote());

  const gradientColors: [string, string] = isDark
    ? ['#0C0C12', '#070709']
    : ['#FAF7F3', '#F5F2EE'];

  const cardBg = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)';
  const borderColor = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.055)';
  const heroBg = isDark ? 'rgba(196,164,84,0.07)' : 'rgba(168,131,42,0.07)';
  const heroBorder = isDark ? 'rgba(196,164,84,0.22)' : 'rgba(168,131,42,0.22)';

  const toggleSave = (i: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const renderItem = ({ item, index }: { item: Quote; index: number }) => {
    const isDaily = index === dailyIndex;
    const isSaved = saved.has(index);
    return (
      <View style={[
        styles.card,
        { backgroundColor: isDaily ? heroBg : cardBg, borderColor: isDaily ? heroBorder : borderColor },
      ]}>
        {isDaily && (
          <Text style={[styles.todayBadge, { color: colors.accentWarm }]}>TODAY</Text>
        )}
        <Text style={[styles.openQuote, { color: isDaily ? colors.accentWarm : colors.border }]}>"</Text>
        <Text style={[styles.quoteText, { color: colors.text }]}>{item.text}</Text>
        <View style={styles.cardFooter}>
          <Text style={[styles.author, { color: colors.textTertiary }]}>— {item.author}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleSave(index)} hitSlop={8}>
              <Text style={{ color: isSaved ? colors.accentWarm : colors.textTertiary, fontSize: 17 }}>
                {isSaved ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Share.share({ message: `"${item.text}" — ${item.author}` })}
              hitSlop={8}
            >
              <Text style={{ color: colors.textTertiary, fontSize: 15 }}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <FlatList
          data={QUOTES}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={[styles.screenTitle, { color: colors.text }]}>Quotes</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                {QUOTES.length} reflections on time
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 56, gap: 10 },
  listHeader: { marginBottom: 8, gap: 4 },
  screenTitle: { fontSize: 28, fontWeight: '200', letterSpacing: -1 },
  subtitle: { fontSize: 12 },

  card: { borderRadius: 16, borderWidth: 1, padding: 20, gap: 10 },
  todayBadge: { fontSize: 9, fontWeight: '700', letterSpacing: 2.5 },
  openQuote: { fontSize: 26, fontWeight: '200', lineHeight: 26 },
  quoteText: { fontSize: 15, fontWeight: '300', lineHeight: 24, letterSpacing: -0.1 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  author: { fontSize: 12, fontWeight: '400' },
  actions: { flexDirection: 'row', gap: 16 },
});
