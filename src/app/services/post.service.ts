import { Injectable } from "@angular/core";
import { map, flatMap, switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from "@angular/fire/storage";
import * as firebase from "firebase/app";
import { Observable, from, combineLatest } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class PostService {
  public userId: string = "";
  public userAuth: boolean;

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        console.log("postService ...  auth = true");
        this.userId = user.uid;
        this.userAuth = true;
      } else {
        console.log("postService ...  auth = false");
        this.userId = "";
        this.userAuth = false;
      }
    });
  }
  addPost(post, poster) {
    //return this.db.collection('places').add(place)
    console.log(post);
    post.creator = this.fireAuth.auth.currentUser.uid;
    post.poster = poster;
    post.created = firebase.firestore.FieldValue.serverTimestamp();
    post.commentCount = 0;
    post.likes = [];
    const imageData = post.img;
    delete post.image;
   // console.log('post detail ' + JSON.stringify(post));
    let documentId = null;
    let storageRef: AngularFireStorageReference = null;

    return this.firestore
      .collection("post")
      .add(post)
      .then((ref) => {
        console.log("ref: ", ref);
        documentId = ref.id;
        storageRef = this.storage.ref(`post/${documentId}`);
        const uploadTask = storageRef.putString(imageData, "base64", {
          contentType: "image/png",
        });
        return uploadTask;
      })
      .then((task) => {
        console.log("task: ", task);
        if (imageData) {
          return storageRef.getDownloadURL().toPromise();
        }
      })
      .then((imageUrl) => {
        console.log("got url: ", imageUrl);
        if (imageData) {
          return this.firestore
            .doc(`post/${documentId}`)
            .update({ img: imageUrl });
        } else {
          return;
        }
      });
  }

  public disLike(postId: string) {
    this.firestore
      .collection("post")
      .doc(postId)
      .ref.update({
        likes: firebase.firestore.FieldValue.arrayRemove(this.userId),
      });
  }
  // Like a post
  public like(postId: string) {
    this.firestore
      .collection("post")
      .doc(postId)
      .ref.update({
        likes: firebase.firestore.FieldValue.arrayUnion(this.userId),
      });
  }

  getPosts(pageSize) {
    console.log("start getPosts");
    return this.firestore
      .collection<any>("post", (ref) => ref.orderBy("created", "desc").limit(pageSize))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const poster = data.creator;

            //console.log("Poster --- > "+poster);
            //console.log("#### posts List ="+ JSON.stringify( data));
            return this.firestore
              .doc("users/" + poster)
              .valueChanges()
              .pipe(
                map((user) => {
                 return Object.assign({id, postUser: user, ...data });
                })
              );
          });
        }),
        flatMap((posts) => combineLatest(posts))
      );
  }

  addComment(id, comment) {
    //return this.db.collection('places').add(place)
    console.log(comment);
    comment.creator = this.fireAuth.auth.currentUser.uid;
    comment.postId = id;
    comment.created = firebase.firestore.FieldValue.serverTimestamp();
    comment.thread = [];
    comment.likes = [];
    //console.log("post detail " + JSON.stringify(comment));
    return this.firestore.collection("post-comment").add(comment);
  }
  addThread(id, thread) {
    //return this.db.collection('places').add(place)
    console.log(thread);
    thread.creator = this.fireAuth.auth.currentUser.uid;
    thread.postId = id;
    thread.created = firebase.firestore.FieldValue.serverTimestamp();
    //console.log("post detail " + JSON.stringify(comment));
    return this.firestore.collection("comment-thread").add(thread);
  }
  public disLikeThread(commentId: string) {
    this.firestore
      .collection('post-comment')
      .doc(commentId)
      .ref.update({
        likes: firebase.firestore.FieldValue.arrayRemove(this.userId),
      });
  }
  // Like a post
  public likeThread(commentId: string) {
    this.firestore
      .collection('post-comment')
      .doc(commentId)
      .ref.update({
        likes: firebase.firestore.FieldValue.arrayUnion(this.userId),
      });
  }

  

  getPostComments(postId) {
    console.log("start getComments");
    return this.firestore
      .collection<any>("post-comment", (ref) =>
        ref.where("postId", "==", postId).orderBy("created", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const poster = data.creator;
            //console.log("Poster --- > "+poster);
            //console.log("#### posts List ="+ JSON.stringify( data));
            return this.firestore
              .doc("users/" + poster)
              .valueChanges()
              .pipe(
                map((user) => {
                  return Object.assign({ id, postUser: user, ...data });
                })
              );
          });
        }),
        flatMap((comments) => combineLatest(comments))
      );
  }


  //           //console.log("#### post  Id ="+id);
  //           const user = this.firestore.collection("users").doc(poster).valueChanges().get();
  //           return { id, ...data };
  //         });
  //       })
  //     );
  // }
}
