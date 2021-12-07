import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireFunctions } from "@angular/fire/compat/functions";
import * as firebase from 'firebase/firestore';
import { merge, Observable } from "rxjs";
import { concat, map, mergeAll, switchMap } from 'rxjs/operators';
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
    private afs: AngularFirestore,
    private cloudFunctions: AngularFireFunctions
  ) { }

  addChatRoom(name: string, uid: string) {
    return this.afs.collection(`rooms/CtG76RZ7LJ1ACjrmwBih/${name}`).add({});
  }

  getRoomNames() {
    // gets the path to every the chat room
    const collections = this.cloudFunctions.httpsCallable('getCollections');
    return collections('').pipe(
      map(roomPaths => {
        console.log(roomPaths);
        let names = [];
        roomPaths.forEach(path => {
          let name = path.split('/')[2];
          names.push(name);
        });
        return names;
      })
    )
  }

  getRooms(): Observable<any> {
    this.afs.doc('rooms/CtG76RZ7LJ1ACjrmwBih').snapshotChanges().subscribe(changes => {
      console.log(changes);
      console.log(changes.payload.data());
    });
    return this.afs.doc('rooms/CtG76RZ7LJ1ACjrmwBih').snapshotChanges();


    // gets the path to every the chat room
    // const collections = this.cloudFunctions.httpsCallable('getCollections');
    // return collections('');

    // returns the doc inside rooms collection
    // return this.afs.collection('rooms').valueChanges({ idField: 'id' })
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

  getUsers() {
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
