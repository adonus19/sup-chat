import { Injectable, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  rooms?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private _currentUser: User;

  get currentUser() {
    return this._currentUser;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this._currentUser = user;
    });
  }

  ngOnInit() {
    this.afAuth.setPersistence('local').then(() => { });
  }

  async signUp({ email, password, firstName, lastName }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = credential.user.uid;

    return this.afs.doc(`users/${uid}`).set({
      uid,
      email: credential.user.email,
      displayName: `${firstName} ${lastName}`,
      rooms: []
    });
  }

  signIn({ email, password }): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  listenForUserUpdates(): Observable<string[]> {
    return (this.afs.doc(`users/${this.currentUser.uid}`).valueChanges(['added', 'removed', { idField: 'uid' }]) as Observable<User>)
      .pipe(
        map(user => {
          console.log(user);
          return user.rooms;
        })
      );
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

}
