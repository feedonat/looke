import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  public userId: string = "";
  public userAuth: boolean;

  //********* shopping cart array ************* */
  private shoppingCart = [];

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {

    this.fireAuth.authState.subscribe(user => {
      if (user) {
        console.log("postService ...  auth = true");
        this.userId = user.uid;
        this.userAuth = true;
      }else{
        console.log("postService ...  auth = false");
        this.userId = "";
        this.userAuth = false;
      }
    });

  }
  addPost(post,poster) {
    //return this.db.collection('places').add(place)
    console.log(post);
    post.creator = this.fireAuth.auth.currentUser.uid;
    post.poster = poster;
    post.created =   firebase.firestore.FieldValue.serverTimestamp();
    post.comments = [];
    const imageData = post.img;
    delete post.image;
    console.log("post detail " +JSON.stringify(post));
    let documentId = null;
    let storageRef: AngularFireStorageReference = null;

    return this.firestore.collection('post').add(post).then(ref => {
      console.log('ref: ', ref);
      documentId = ref.id;
      storageRef = this.storage.ref(`post/${documentId}`);
        const uploadTask = storageRef.putString(imageData, 'base64', { contentType: 'image/png'});
        return uploadTask;      

    }).then(task => {
      console.log('task: ', task);
      if(imageData){
      return storageRef.getDownloadURL().toPromise();
      }
    }).then(imageUrl => {

      console.log('got url: ', imageUrl);
      if(imageData){
      return this.firestore.doc(`post/${documentId}`).update({ img: imageUrl });
      } else {
        return;
      }
    });
  }


  getPosts() {
    console.log("start getPosts");
    return this.firestore.collection<any>('post', ref => ref.orderBy('created' , 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          //console.log("#### posts List ="+ JSON.stringify( data));
          //console.log("#### post  Id ="+id);
          return { id, ...data };
        });
      })
    );
  
  }
}
