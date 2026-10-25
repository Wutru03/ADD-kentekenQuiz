// "25-hg-rj" -> "25HGRJ": uppercase, keep only letters and digits.
export function normalisePlate(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Only the length is checked; sidecodes (XX-99-99 etc.) are out of scope.
export function isValidPlate(plate: string): boolean {
  return plate.length === 6;
}
