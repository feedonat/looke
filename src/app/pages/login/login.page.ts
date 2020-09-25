import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  LoadingController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
} from "@angular/animations";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  animations: [
    trigger("staggerIn", [
      transition("* => *", [
        query(
          ":enter",
          style({ opacity: 0, transform: `translate3d(0,10px,0)` }),
          { optional: true }
        ),
        query(
          ":enter",
          stagger("100ms", [
            animate(
              "300ms",
              style({ opacity: 1, transform: `translate3d(0,0,0)` })
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class LoginPage implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoggedIn = false;
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  @ViewChild("flipcontainer", { static: false }) flipcontainer: ElementRef;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private fbook: Facebook,
    private authService: AuthService
  ) {
    fbook
      .getLoginStatus()
      .then((res) => {
        console.log(res.status);
        if (res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch((e) => console.log(e));
  }
  fbLogin() {
    this.fbook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          this.afAuth.auth.signInWithCredential(credential).then(info => {
            console.log(JSON.stringify(info));
            this.db.doc(`users/${info.user.uid}`).set({
              name: info.user.displayName,
              email: info.user.email,
              role: "user",
              img: info.user.photoURL,
              created: firebase.firestore.FieldValue.serverTimestamp(),
            });
            this.navigateByRole("USER");
          });
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid: any) {
    this.fbook.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => {
        console.log(res);
        this.users = res;
      })
      .catch(e => {
        console.log(e);
      });
  }
  logout() {
    this.fbook.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      name: ["", Validators.required],
      role: ["USER", Validators.required],
    });

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }
  navigateByRole(role) {
    if (role == "USER") {
      this.router.navigateByUrl("1/post");
    } else if (role == "ADMIN") {
      this.router.navigateByUrl("1/post");
    }
  }

  async login() {
    let loading = await this.loadingCtrl.create({
      message: "Loading...",
    });
    await loading.present();

    this.authService.signIn(this.loginForm.value).subscribe(
      (user) => {
        loading.dismiss();
        console.log("after login: ", user);
        this.navigateByRole(user["role"]);
      },
      async (err) => {
        loading.dismiss();

        let alert = await this.alertCtrl.create({
          header: "Error",
          message: err.message,
          buttons: ["OK"],
        });
        alert.present();
      }
    );
  }

  async register() {
    let loading = await this.loadingCtrl.create({
      message: "Loading...",
    });
    await loading.present();

    this.authService.signUp(this.registerForm.value).then(
      async (res) => {
        await loading.dismiss();

        let toast = await this.toastCtrl.create({
          duration: 3000,
          message: "Successfully created new Account!",
        });
        toast.present();
        console.log("finished: ", res);
        this.navigateByRole(this.registerForm.value["role"]);
      },
      async (err) => {
        await loading.dismiss();

        let alert = await this.alertCtrl.create({
          header: "Error",
          message: err.message,
          buttons: ["OK"],
        });
        alert.present();
      }
    );
  }
  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle("flip");
  }

  facebookLogin() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((res) => {
        console.log(res);
        if (res) {
          this.db.doc(`users/${res.user.uid}`).set({
            name: res.user.displayName,
            email: res.user.email,
            role: "user",
            img: res.user.photoURL,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          });
          this.navigateByRole("USER");
        } else {
          console.error("error");
        }
      });
  }
}
