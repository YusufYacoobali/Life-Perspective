export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isReasonableAge(dateString: string): { valid: boolean; message?: string } {
  const dob = new Date(dateString);
  const now = new Date();
  const ageMs = now.getTime() - dob.getTime();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);

  if (ageYears < 1) return { valid: false, message: 'Age must be at least 1 year.' };
  if (ageYears > 130) return { valid: false, message: 'Please enter a valid birth year.' };
  if (dob > now) return { valid: false, message: 'Date of birth cannot be in the future.' };

  return { valid: true };
}

export function isValidHeight(cm: number): boolean {
  return cm >= 50 && cm <= 280;
}

export function isValidWeight(kg: number): boolean {
  return kg >= 2 && kg <= 500;
}

export function ftToCm(feet: number, inches: number): number {
  return Math.round((feet * 30.48) + (inches * 2.54));
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}
