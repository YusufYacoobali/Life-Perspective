# CLAUDE.md

## Project Overview

This is a minimalist mobile app built with Expo React Native and TypeScript.

The app helps users put time into perspective by estimating their expected lifespan and showing:

- how much life they have already used
- how much life they may have left
- time remaining in years, months, weeks, days, hours and minutes
- clean visual progress indicators
- reflective time-related quotes
- high-quality iOS and Android widgets

The app should feel calm, premium, thoughtful and emotionally impactful, not gimmicky or depressing.

Working app name ideas:
- Time Left
- Lifetime
- Memento
- Life Clock
- Remaining

Use `Time Left` as the placeholder name unless changed later.

---

## Core Product Goal

The app should answer one simple question beautifully:

> “How much time might I have left?”

It should make the user reflect on how valuable their time is, using a clean interface and meaningful numbers.

The experience should be:

- minimalist
- fast
- emotionally powerful
- visually clean
- easy to understand
- not cluttered with too many stats
- privacy-conscious

---

## Tech Stack

Use:

- Expo React Native
- TypeScript
- Expo Router or React Navigation
- AsyncStorage or SQLite for local persistence
- Reusable components
- Clean folder structure
- Theme system for light/dark mode
- iOS widgets where possible
- Android widgets where possible

Avoid unnecessary backend work for the first version.

All user data should be stored locally unless there is a clear reason not to.

---

## Core User Inputs

The onboarding flow should collect:

- country
- date of birth or current age
- gender
- height
- weight
- smoking status
- activity level
- optional health/lifestyle factors

The app should not claim medical accuracy.

Use clear wording such as:

> “This is an estimate based on broad statistical and lifestyle factors. It is not medical advice.”

---

## Life Expectancy Estimation

Start with a simple local calculation.

Suggested approach:

1. Use a base life expectancy based on country and gender.
2. Adjust based on lifestyle factors.
3. Calculate estimated age at death.
4. Calculate time already lived and estimated time remaining.

Example adjustment factors:

- smoking: reduce estimate
- regular exercise: increase estimate
- obesity/very low BMI: reduce estimate
- healthy BMI: slight increase
- country baseline: affects starting estimate
- gender: affects starting estimate

Keep the logic understandable and easy to edit.

Place life expectancy logic in its own file, for example:

```ts
src/lib/lifeExpectancy.ts
```

The first version can use approximate baseline data. Later, this can be improved with official datasets.

Important: never present the estimate as guaranteed or exact.

---

## Main Screens

### 1. Onboarding Screen

Collect user details with a premium, minimal form.

Should include:

- calm intro text
- simple step-by-step questions
- progress indicator
- clean controls
- ability to edit later

### 2. Home Screen

The main screen should show:

- large time-left number
- percentage of life used
- percentage of life remaining
- elegant progress ring or progress bar
- selected quote
- subtle “as of now” live updating feel

Possible display:

```text
You may have used 31% of your life.

Estimated time left:
52 years
624 months
2,714 weeks
18,998 days
```

Keep the design extremely clean.

### 3. Breakdown Screen

Show more detailed time stats:

- years lived
- years left
- weeks lived
- weeks left
- days lived
- days left
- heartbeats estimate maybe optional
- sleeps left maybe optional

Do not overload the home screen.

### 4. Quotes Screen

A clean list of time-related quotes.

Include favourite/save quote feature if simple.

### 5. Settings Screen

Allow the user to:

- update profile details
- change theme
- change widget display mode
- reset data
- read disclaimer

---

## Widget Requirements

The app should have polished widgets for both iOS and Android.

Widget ideas:

### Minimal Progress Widget

Shows:

- percentage of life used
- thin progress bar
- short quote

Example:

```text
31% used
Make today count.
```

### Days Left Widget

Shows:

```text
~18,998 days left
Time is your most valuable asset.
```

### Week Grid Widget

Shows a small grid of life weeks, inspired by “your life in weeks”.

Used weeks filled, remaining weeks empty.

### Quote Widget

Shows one short quote per day.

### Countdown Widget

Shows live-feeling values:

```text
52y 3m left
```

Widget design should be:

- clean
- readable at small sizes
- not too much text
- dark/light mode friendly
- premium and calm

Important: widgets may need native code or config plugins depending on Expo support. Investigate the best current approach before implementing.

---

## Design Direction

Visual style:

- minimalist
- premium
- calm
- soft contrast
- lots of spacing
- no clutter
- thoughtful typography
- subtle animations
- dark mode should look especially polished

Avoid:

- loud colours
- childish gamification
- scary/death-heavy visuals
- too many charts
- medical-looking UI

Suggested colours:

- off-white background
- charcoal text
- muted grey borders
- soft blue or amber accent
- deep black/charcoal dark mode

Use a central theme file for colours, spacing and typography.

---

## Suggested Folder Structure

```text
src/
  app/
    index.tsx
    onboarding.tsx
    breakdown.tsx
    quotes.tsx
    settings.tsx

  components/
    ProgressRing.tsx
    StatCard.tsx
    QuoteCard.tsx
    AppButton.tsx
    AppInput.tsx
    Screen.tsx

  lib/
    lifeExpectancy.ts
    timeCalculations.ts
    quotes.ts
    validation.ts

  store/
    userProfileStore.ts

  theme/
    colors.ts
    spacing.ts
    typography.ts

  types/
    user.ts
    lifeStats.ts
```

Adapt if the existing project structure is different.

---

## Agent Instructions

Use separate agents where useful.

### UI Agent

Responsible for:

- screens
- layout
- components
- visual polish
- animations
- dark mode styling
- widget visual design

### State Agent

Responsible for:

- user profile state
- persistence
- calculation logic
- validation
- updating stats when user edits details

### Widget Agent

Responsible for:

- iOS widget implementation research
- Android widget implementation research
- widget data syncing
- widget layouts
- native config if needed

### QA Agent

Responsible for:

- checking edge cases
- invalid inputs
- unrealistic ages
- missing data
- TypeScript errors
- broken navigation
- widget update issues

### Release Agent

Responsible for:

- app.json/app.config.ts
- app icons
- splash screen
- permissions
- App Store / Play Store readiness
- privacy wording
- build checks

---

## Development Rules

Follow these rules:

- Use TypeScript properly.
- Keep components small and reusable.
- Do not hardcode calculation logic inside screens.
- Keep business logic inside `lib/`.
- Keep user profile state separate from UI.
- Do not rewrite the entire app unless necessary.
- Prefer simple clean code over over-engineering.
- Use comments only where they genuinely help.
- Make the app feel polished even in MVP form.
- Run checks after major changes.

---

## Commands

Use these commands where relevant:

```bash
npm install
npx expo start
npx expo run:ios --device
npx expo run:android
npm run typecheck
```

If a command does not exist, either create it properly or explain what is missing.

---

## First Build Task

When starting from scratch, build in this order:

1. Create the Expo TypeScript structure.
2. Build onboarding.
3. Add local profile storage.
4. Add life expectancy calculation logic.
5. Build the home dashboard.
6. Add breakdown screen.
7. Add quotes.
8. Add settings.
9. Add widget investigation and implementation.
10. Polish UI and run checks.

---

## First Prompt to Use with Claude

Use this prompt after creating this file:

```text
Read CLAUDE.md carefully. Build the first MVP of this Expo React Native TypeScript app.

Start with the full app structure, onboarding flow, local storage, life expectancy calculation logic, home screen, breakdown screen, quotes screen and settings screen.

Use the UI agent for polished screens, the State agent for profile/calculation/storage, and the QA agent to check edge cases and TypeScript errors.

Do not over-engineer it. Make it clean, premium and usable. Run checks after major changes and fix issues before finishing.
```

---

## Important Disclaimer Text

Use this somewhere in onboarding/settings:

```text
This app provides an approximate life expectancy estimate based on broad statistical and lifestyle factors. It is intended for reflection only and is not medical, health or financial advice.
```

---

## Quote Examples

Use short quotes only.

Examples:

- “The trouble is, you think you have time.”
- “Lost time is never found again.”
- “The key is in not spending time, but in investing it.”
- “Your time is limited, so do not waste it living someone else’s life.”
- “Time is what we want most, but what we use worst.”

Check quote attribution before showing named authors in production.
