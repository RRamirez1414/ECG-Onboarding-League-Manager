export function getAgeFromDob(dob: string, referenceDate: Date = new Date()): number {
  const birthDate = new Date(dob);
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

export function isAtLeastAge(dob: string, minimumAge: number, referenceDate: Date = new Date()): boolean {
  return getAgeFromDob(dob, referenceDate) >= minimumAge;
}
