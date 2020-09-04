import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
import { map } from 'rxjs/internal/operators/map';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private db: AngularFirestore) { }

  increamentCounter(collection , doc) {
    // tslint:disable-next-line: prefer-const
    let chainCounterRef = this.db.collection(collection).doc(doc);
    chainCounterRef.update({ count: firebase.firestore.FieldValue.increment(1) });
  }
  addToArray(doc,data) {
    // tslint:disable-next-line: prefer-const
    let chainCounterRef = this.db.doc(doc);
    chainCounterRef.update({ groups: firebase.firestore.FieldValue.arrayUnion(data) });
  }

  getUserList() {
    return this.db.collection('users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        console.log("user list"+JSON.stringify(data));
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
