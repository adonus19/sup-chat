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

  users: User[];

  constructor(
    private afs: AngularFirestore
  ) { }

  addChatRoom(name: string, uid: string) {
    return this.afs.collection(`rooms/${name}`);
  }

  getRooms(): Observable<any> {
    this.afs.collection('rooms').get().subscribe(res => {
      res.forEach(doc => {
        doc.ref.path;
        this.afs.doc(doc.ref.path).collection('')
      })
    })
    return this.afs.collection('rooms').valueChanges({ idField: 'id' })
  }

  addChatMessage(msg: string, uid: string) {
    return this.afs.collection('messages')
      .add({ msg, from: uid, createdAt: firebase.serverTimestamp() });
  }

  getChatMessages(uid: string): Observable<Message[]> {
    if (!this.users) {
      return (this.afs.collection('messages', ref => ref.orderBy('createdAt'))
        .valueChanges({ idField: 'id' }) as Observable<Message[]>).pipe(
          map(messages => {
            for (const m of messages) {
              m.fromName = this.getUserFromMsg(m.from, this.users);
              m.myMsg = m.from === uid;
            }
            return messages;
          })
        )
    } else {
      return this.getUsers().pipe(
        switchMap(res => {
          this.users = res;
          return this.afs.collection('messages', ref => ref.orderBy('createdAt'))
            .valueChanges({ idField: 'id' }) as Observable<Message[]>;
        }),
        map(messages => {
          for (const m of messages) {
            m.fromName = this.getUserFromMsg(m.from, this.users);
            m.myMsg = m.from === uid;
          }
          return messages;
        })
      );
    }
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
