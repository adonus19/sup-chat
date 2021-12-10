import { Injectable, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { User } from "../models/user.model";
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
    this.afAuth.onAuthStateChanged(authUser => {
      console.log(authUser)
      this.userService.currentUser = authUser;
      this.userService.getUserDocObject().subscribe(user => {
        console.log(user);
        this.userService.currentUser = user;
      });
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

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const user: User = {
      uid: credential.user.uid,
      displayName: credential.user.displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL
    }
    console.log(user);
    return this.updateUser(user);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  private updateUser(user: User) {
    console.log(user);
    return this.afs.doc<User>(`users/${user.uid}`).get()
      .pipe(
        switchMap(doc => {
          const data = doc.data();
          console.log(data);
          if (!data.rooms) {
            user.rooms = [];
          }
          return this.afs.doc(`users/${user.uid}`).set(user, { merge: true })
        })
      ).subscribe();
  }

}
