import * as Haptics from 'expo-haptics';
import { getHapticsEnabled } from '../store/settingsStore';

export function hapticLight() {
  if (!getHapticsEnabled()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticMedium() {
  if (!getHapticsEnabled()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function hapticSelection() {
  if (!getHapticsEnabled()) return;
  Haptics.selectionAsync().catch(() => {});
}
