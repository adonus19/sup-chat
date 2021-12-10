import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsers: User[];
  private _currentUser: User;

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(user) {
    this._currentUser = user;
  }

  constructor(
    private afs: AngularFirestore
  ) { }

  getUserDocObject(): Observable<User> {
    return this.afs.doc<User>(`users/${this.currentUser.uid}`).get()
      .pipe(
        map(user => {
          return user.data();
        })
      );
  }

  getAllUsers(uid: string): Observable<User[]> {
    return (this.afs.collection('users', ref => ref.where('uid', '!=', uid)).valueChanges({ idField: 'uid' }) as Observable<User[]>)
      .pipe(
        tap(users => {
          this.allUsers = users;
        })
      );
  }

  getUserRooms(): Observable<string[]> {
    return this.afs.doc<User>(`users/${this.currentUser.uid}`).get()
      .pipe(
        map(user => {
          const data = user.data();
          return data.rooms;
        })
      );
  }

  listenForUserRoomUpdates(): Observable<string[]> {
    return (this.afs.doc(`users/${this.currentUser.uid}`).valueChanges(['added', 'removed', { idField: 'uid' }]) as Observable<User>)
      .pipe(
        map(user => {
          return user.rooms;
        })
      );
  }

}
