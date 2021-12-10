export interface User {
  uid: string;
  email: string;
  displayName: string;
  rooms?: string[];
  photoURL?: string;
}
