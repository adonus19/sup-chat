import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as firebase from 'firebase/firestore';
import { Observable } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { User } from "./auth.service";

export interface Message {
  createdAt: firebase.FieldValue,
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore
  ) { }

  addChatMessage(msg: string, uid: string) {
    return this.afs.collection('messages')
      .add({ msg, from: uid, createdAt: firebase.serverTimestamp() });
  }

  getChatMessages(uid: string): Observable<Message[]> {
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.afs.collection('messages', ref => ref.orderBy('createdAt'))
          .valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map(messages => {
        for (const m of messages) {
          m.fromName = this.getUserFromMsg(m.from, users);
          m.myMsg = m.from === uid;
        }
        return messages;
      })
    );
  }

  private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  private getUserFromMsg(msgFromId, users: User[]): string {
    for (const user of users) {
      if (user.uid == msgFromId) {
        return user.displayName;
      }
    }
    return 'Deleted';
  }
}
