import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import { map } from "rxjs/internal/operators/map";
import { flatMap } from "rxjs/operators";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { query } from "@angular/animations";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root",
})
export class UserServiceService {
  userGroups = [];
  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  getOneUser(id) {
    return this.db.doc(`users/${id}`).valueChanges();
  }

  // getGroups(userid) {
  //   console.log("start getGroups" + JSON.stringify(userid));
  //   return this.db
  //     .collection("groups", (q) =>
  //       q.where("members", "array-contains-any", [userid])
  //     )
  //     .valueChanges();
  // }

  getGroups(user) {
    console.log('start getGroups');
    return this.db
      .collection<any>('group-member', (ref) => ref.where('userId','==',user)   .orderBy("created", "desc"))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const groupId = data.groupId;
            console.log("#### group ID =" + JSON.stringify(groupId));
            console.log("#### group-member =" + JSON.stringify(data));
            return this.db
              .doc("groups/"+groupId)
              .valueChanges()
              .pipe(
                map((g) => {
                  console.log("Member List 12344556666 " + JSON.stringify(g));
                  return Object.assign({ id, group: g, ...data });
                })
              );
          });
        }),
        flatMap((posts) => combineLatest(posts))
      );
  }


 getGroupMembersList(list) {
    const listArr = list.length > 0 ? list : ['89008908080'];
    console.log("start get members with paramater " + listArr);
    return this.db
              .collection('groups', (ref) =>
                ref.where(firebase.firestore.FieldPath.documentId(), 'in', list)
              ).snapshotChanges().pipe(map((action) => {
                 return action.map(a => {
                  const data = a.payload.doc.data;
                  const id = a.payload.doc.id;
                  return Object.assign({id, ...data});
                 });
              }));
  }

  getUserGroupList(list) {
    const listArr = list.length > 0 ? list : ["89008908080"];
    console.log('start get members with paramater ' + listArr);
    return this.db
      .collection("groups", (ref) =>
        ref.where(firebase.firestore.FieldPath.documentId(), "in", list)
      )
      .valueChanges();
  }

  getPosts(userId) {
    console.log("start getPosts");
    return this.db
      .collection<any>("post", (ref) =>
        ref.where("creator", "==", userId).orderBy("created", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const poster = data.creator;

            // console.log("Poster --- > "+poster);
            console.log("#### posts List =" + JSON.stringify(data));
            return this.db
              .doc("users/" + poster)
              .valueChanges()
              .pipe(
                map((user) => {
                  return Object.assign({ id, postUser: user, ...data });
                })
              );
          });
        }),
        flatMap((posts) => combineLatest(posts))
      );
  }
}
