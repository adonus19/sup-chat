import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireFunctions } from "@angular/fire/compat/functions";
import * as firebase from 'firebase/firestore';
import { Observable } from "rxjs";
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from "../models/user.model";
import { Message } from '../models/message.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  allUsers: User[];
  collectionPaths: string[];

  constructor(
    private afs: AngularFirestore,
    private cloudFunctions: AngularFireFunctions
  ) { }

  addChatRoom(name: string, uid: string, users: User[]) {
    return this.afs.doc('rooms/CtG76RZ7LJ1ACjrmwBih').get()
      .pipe(
        switchMap(doc => {
          const chats = (doc.data() as { chats: string[] });
          chats.chats.push(name);
          return this.afs.doc('rooms/CtG76RZ7LJ1ACjrmwBih').update({ chats: chats.chats })
        }),
        switchMap(() => {
          const updatedUsers = this.updateUsersRooms(users, name);
          const batch = this.afs.firestore.batch();
          for (const user of updatedUsers) {
            const ref = this.afs.collection('users').doc(user.uid).ref;
            batch.update(ref, { rooms: user.rooms });
          }
          return batch.commit();
        }),
        switchMap(() => {
          return this.afs.collection(`rooms/CtG76RZ7LJ1ACjrmwBih/${name}`).add({})
        })
      ).subscribe();
  }

  getRoomNames() {
    // gets the path to every the chat room
    const collections = this.cloudFunctions.httpsCallable('getCollections');
    return collections('').pipe(
      map(roomPaths => {
        this.collectionPaths = roomPaths;
        let names = [];
        roomPaths.forEach(path => {
          let name = path.split('/')[2];
          names.push(name);
        });
        return names;
      })
    )
  }

  getUserRoomsObservables(rooms: string[]) {
    const roomsObservables: { room: string; messages: Observable<Message[]> }[] = [];
    for (const room of rooms) {
      roomsObservables.push({
        room,
        messages: this.getLastMessage(room)
      });
    }
    return roomsObservables;
  }

  addChatMessage(msg: string, uid: string, room: string) {
    return this.afs.collection(`rooms/CtG76RZ7LJ1ACjrmwBih/${room}`)
      .add({ msg, from: uid, createdAt: firebase.serverTimestamp() });
  }

  getAllChatMessages(room: string) {
    return this.afs.collection<Message>(`rooms/CtG76RZ7LJ1ACjrmwBih/${room}`, ref => ref.orderBy('createdAt')).get();
  }

  getChatMessages(room: string) {
    return this.afs.collection(`rooms/CtG76RZ7LJ1ACjrmwBih/${room}`, ref => ref.orderBy('createdAt'))
      .valueChanges({ idField: 'id' }) as Observable<Message[]>;
  }

  getLastMessage(room: string) {
    return this.afs.collection<Message>(`rooms/CtG76RZ7LJ1ACjrmwBih/${room}`, ref => ref.orderBy('createdAt').limitToLast(1))
      .valueChanges({ idField: 'id' });
  }

  getChatSpecificUsers(room: string) {
    return this.afs.collection<User>('users', ref => ref.where('rooms', 'array-contains', room)).get()
      .pipe(
        map(data => {
          const users: User[] = []
          data.forEach(doc => {
            users.push(doc.data());
          });
          return users;
        })
      )
  }

  private updateUsersRooms(users: User[], chatName: string) {
    for (const user of users) {
      user.rooms.push(chatName);
    }
    return users;
  }
}
