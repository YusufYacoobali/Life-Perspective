import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme';

const FOCUS_KEY = '@time_left_focus';

interface StoredFocus {
  date: string;
  text: string;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function TodayFocusCard() {
  const { colors, isDark } = useTheme();
  const [focus, setFocus] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem(FOCUS_KEY).then((raw) => {
      if (!raw) return;
      const saved: StoredFocus = JSON.parse(raw);
      if (saved.date === todayStr()) setFocus(saved.text);
    });
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 600, useNativeDriver: true }).start();
  }, []);

  const startEditing = () => {
    setDraft(focus);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const save = async () => {
    const text = draft.trim();
    setFocus(text);
    setEditing(false);
    Keyboard.dismiss();
    if (text) {
      await AsyncStorage.setItem(FOCUS_KEY, JSON.stringify({ date: todayStr(), text }));
    } else {
      await AsyncStorage.removeItem(FOCUS_KEY);
    }
  };

  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <Animated.View
      style={[styles.card, { backgroundColor: cardBg, borderColor, opacity: fadeAnim }]}
    >
      <Text style={[styles.prompt, { color: colors.textTertiary }]}>
        TODAY'S INTENTION
      </Text>

      {editing ? (
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="What would make today worth remembering?"
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { color: colors.text }]}
            multiline
            onSubmitEditing={save}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: colors.accent }]}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={startEditing} activeOpacity={0.7}>
          {focus ? (
            <Text style={[styles.focusText, { color: colors.text }]}>{focus}</Text>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
              What would make today worth remembering?
            </Text>
          )}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  prompt: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  focusText: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  inputRow: {
    gap: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    letterSpacing: -0.2,
    minHeight: 48,
  },
  saveBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
