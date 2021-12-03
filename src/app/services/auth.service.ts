import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";

export interface User {
  uid: string;
  email: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  async signUp({ email, password, firstName, lastName }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = credential.user.uid;

    return this.afs.doc(`users/${uid}`).set({ uid, email: credential.user.email, displayName: `${firstName} ${lastName}` });
  }

  signIn({ email, password }): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

}
