import { Injectable, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private userService: UserService
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this.userService.currentUser = user;
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

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

}
