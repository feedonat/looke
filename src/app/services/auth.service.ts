import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NavController, ToastController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>;
  uuid = null;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private navCtrl: NavController,
              private router: Router,
              private toastCtrl: ToastController,
              private storage: AngularFireStorage) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.uuid = user.uid;
          return this.db.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  signIn(credentials): Observable<any> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
      switchMap(user => {
        console.log('real user: ', user);
        if (user) {
          return this.db.doc(`users/${user.user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(data => {
      console.log('after register: ', data);
      return this.db.doc(`users/${data.user.uid}`).set({
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }

updateProfiel(record) {
  let storageRef: AngularFireStorageReference = null;
  const imageData = record.img;
  this.uuid = this.afAuth.auth.currentUser.uid;
  console.log('record ' + JSON.stringify(record));
  console.log('uuid ' + this.uuid);
  this.db.doc('users/' + this.uuid).update(record).then(() => {
      storageRef = this.storage.ref(`users/${this.uuid}`);
      const uploadTask = storageRef.putString(imageData, 'base64', { contentType: 'image/png'});
      return uploadTask;

  }).then(task => {
    console.log('task: ', task);
    return storageRef.getDownloadURL().toPromise();
  }).then(imageUrl => {
    console.log('got url: ', imageUrl);
    return this.db.doc(`users/${this.uuid}`).update({ img: imageUrl });
  });

  }

signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.user = null;
      this.navCtrl.navigateRoot('/');
    });
  }

isLoggedIn() {
    if (this.user == null ) {
        return false;
      } else {
        return true;
      }
    }
logout() {
      this.afAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
    }

getCurrentUser() {
    this.user = this.afAuth.authState.pipe(
    switchMap(user => {
        if (user) {
         return this.db.doc(`users/${user.uid}`).valueChanges();
         } else {
          return of(null);
        }
     })
     );
    return this.user;
  }

}
