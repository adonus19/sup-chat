import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  getUserRooms(): Observable<string[]> {
    return this.afs.doc<User>(`users/${this.currentUser.uid}`).get()
      .pipe(
        map(user => {
          const data = user.data();
          return data.rooms;
        })
      );
  }

  listenForUserUpdates(): Observable<string[]> {
    return (this.afs.doc(`users/${this.currentUser.uid}`).valueChanges(['added', 'removed', { idField: 'uid' }]) as Observable<User>)
      .pipe(
        map(user => {
          return user.rooms;
        })
      );
  }

}
