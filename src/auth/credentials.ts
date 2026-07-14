// @sos-edit: false

export const ADMIN_EMAIL = 'peboorba@gmail.com';
export const ADMIN_PASSWORD_HASH = 'bd4a57806fd4426fb2e2e0f188d5e5af6d48fb163897ba57328dabfbb27d7208';

const AUTH_KEY = 'queluzito_admin_auth';

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function setAuthenticated(val: boolean): void {
  if (val) {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}
