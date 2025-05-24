
export function isValidString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value !== '' && value !== "" && value !== null;
}


export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}