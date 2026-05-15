import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const KEY_SESSIONS = '@review_session_count';
const KEY_FIRST_OPEN = '@review_first_open_date';
const KEY_LAST_PROMPTED = '@review_last_prompted_session';

// Prompt on sessions 5, 20, 50 — meaningful engagement milestones
const PROMPT_AT_SESSIONS = [5, 20, 50];

// Must have been installed for at least 2 days before first prompt
const MIN_DAYS_SINCE_INSTALL = 2;

export async function trackSessionAndMaybeReview(): Promise<void> {
  try {
    const available = await StoreReview.isAvailableAsync();
    if (!available) return;

    const now = Date.now();

    // Record first open date if not set
    const firstOpenRaw = await AsyncStorage.getItem(KEY_FIRST_OPEN);
    if (!firstOpenRaw) {
      await AsyncStorage.setItem(KEY_FIRST_OPEN, String(now));
      // Increment session but don't prompt on very first open
      await AsyncStorage.setItem(KEY_SESSIONS, '1');
      return;
    }

    const firstOpen = parseInt(firstOpenRaw, 10);
    const daysSinceInstall = (now - firstOpen) / (1000 * 60 * 60 * 24);
    if (daysSinceInstall < MIN_DAYS_SINCE_INSTALL) {
      const raw = await AsyncStorage.getItem(KEY_SESSIONS);
      const count = raw ? parseInt(raw, 10) : 0;
      await AsyncStorage.setItem(KEY_SESSIONS, String(count + 1));
      return;
    }

    // Increment session count
    const raw = await AsyncStorage.getItem(KEY_SESSIONS);
    const sessions = (raw ? parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(KEY_SESSIONS, String(sessions));

    // Check if this session is a prompt milestone
    if (!PROMPT_AT_SESSIONS.includes(sessions)) return;

    // Avoid re-prompting the same session (e.g. hot reload)
    const lastPrompted = await AsyncStorage.getItem(KEY_LAST_PROMPTED);
    if (lastPrompted && parseInt(lastPrompted, 10) === sessions) return;

    await AsyncStorage.setItem(KEY_LAST_PROMPTED, String(sessions));

    // Small delay so the app feels settled before the sheet appears
    await new Promise((resolve) => setTimeout(resolve, 2500));

    await StoreReview.requestReview();
  } catch {
    // Never crash the app over a review prompt
  }
}
