import { Injectable } from "@angular/core";
import { map, flatMap, switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from "@angular/fire/storage";
import * as firebase from "firebase/app";
import { combineLatest } from "rxjs";
import { CommonService } from "./common.service";
@Injectable({
  providedIn: "root",
})
export class GroupService {
  public userId: string = "";
  public member;
  private data = {
    PropertyA: 1,
    PropertyB: 2,
    PropertyC: 3,
  };
  public userAuth: boolean;
  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private commonService: CommonService
  ) {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        console.log("postService ...  auth = true");
        this.userId = user.uid;
        this.member = user;
        this.userAuth = true;
      } else {
        console.log("postService ...  auth = false");
        this.userId = "";
        this.userAuth = false;
      }
    });
  }
  getCategories() {
    return this.firestore
      .collection("post-category")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            console.log("category list" + JSON.stringify(data));
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  addGroup(group, groupCreator) {
    //return this.db.collection('places').add(place)
    console.log(group);
    group.admin = groupCreator;
    group.created = firebase.firestore.FieldValue.serverTimestamp();
    group.members = [];
    const imageData = group.coverImg;
    delete group.image;
    // console.log('post detail ' + JSON.stringify(post));
    let documentId = null;
    let storageRef: AngularFireStorageReference = null;

    return this.firestore
      .collection("groups")
      .add(group)
      .then((ref) => {
        console.log("ref: ", ref);
        documentId = ref.id;
        storageRef = this.storage.ref(`groups/${documentId}`);
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
            .doc(`groups/${documentId}`)
            .update({ coverImg: imageUrl });
        } else {
          return;
        }
      });
  }

  public leaveGroup(member) {
    this.firestore
      .collection("groups")
      .doc(member)
      .ref.update({
        likes: firebase.firestore.FieldValue.arrayRemove(this.member),
      });
  }
  // be a member - join the group
  public joinGroup(user, groupID) {
    this.firestore
      .doc('groups/' + groupID)
      .update({ members: firebase.firestore.FieldValue.arrayUnion(user) })
      .then();

    return this.firestore
      .doc('users/' + this.fireAuth.auth.currentUser.uid)
      .update({ groups: firebase.firestore.FieldValue.arrayUnion(groupID) });
  }

  getGroups() {
    console.log('start getGroups');
    return this.firestore
      .collection<any>('groups', (ref) => ref.orderBy("created", "desc"))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const admin = data.admin;
            const gMembers: [] =
              data.members.length > 0
                ? data.members
                : ["809809898098098777777"];
            console.log("Poster --- > " + gMembers);
            console.log("#### group List =" + JSON.stringify(data));
            return this.firestore
              .collection("users", (ref) =>
                ref.where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  gMembers
                )
              )
              .valueChanges()
              .pipe(
                map((members) => {
                  console.log("Member List " + JSON.stringify(members));
                  return Object.assign({ id, gMembers: members, ...data });
                })
              );
          });
        }),
        flatMap((posts) => combineLatest(posts))
      );
  }

  getGroupMembersList(list,limit) {
    const listArr = list.length > 0 ? list : ['89008908080'];
    console.log('start get members with paramater ' + listArr);
    return this.firestore
      .collection('users', (ref) =>
        ref.where(firebase.firestore.FieldPath.documentId(), 'in', list).limit(limit))
      .valueChanges();
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
  getGroupMembers(members) {
    console.log("start getMembers with id" + JSON.stringify(members));
    return this.firestore
      .collection<any>("users", (ref) => ref.where("uid", "in", members))
      .get();
  }
  getOneGroup(id) {
    return this.firestore.doc(`groups/${id}`).valueChanges();
  }

  //           //console.log("#### post  Id ="+id);
  //           const user = this.firestore.collection("users").doc(poster).valueChanges().get();
  //           return { id, ...data };
  //         });
  //       })
  //     );
  // }
}
