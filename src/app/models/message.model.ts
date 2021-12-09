import { FieldValue } from 'firebase/firestore';

export interface Message {
  createdAt: FieldValue,
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}
