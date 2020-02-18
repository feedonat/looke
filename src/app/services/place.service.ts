import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage) { }

  addPlace(place) {
    //return this.db.collection('places').add(place)


    place.creator = this.afAuth.auth.currentUser.uid;
    const imageData = place.img;
    delete place.image;

    let documentId = null;
    let storageRef: AngularFireStorageReference = null;

    return this.db.collection('places').add(place).then(ref => {
      console.log('ref: ', ref);
      documentId = ref.id;
      storageRef = this.storage.ref(`places/${documentId}`);
      const uploadTask = storageRef.putString(imageData, 'base64', { contentType: 'image/png'});
      return uploadTask;
    }).then(task => {
      console.log('task: ', task);
      return storageRef.getDownloadURL().toPromise();
    }).then(imageUrl => {
      console.log('got url: ', imageUrl);
      return this.db.doc(`places/${documentId}`).update({ img: imageUrl });
    });

  }
  getOnePlace(id) {
    return this.db.doc(`places/${id}`).valueChanges();
  }

  getAllPlaces() {
    return this.db.collection('places').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
  }
}

