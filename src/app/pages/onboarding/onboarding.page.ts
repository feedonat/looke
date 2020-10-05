import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { AlertController, IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  constructor(private storage: Storage,
     private router: Router,
     private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private fbook: Facebook,
    private authService: AuthService
     
     ) { }

  public fullName;
  public gender;
  public address;
  public email;
  public password;
  ngOnInit() {
  }


  next() {
    this.slides.slideNext();
    console.log('name'+this.fullName)
    console.log('name'+this.gender)
    console.log('name'+this.address)
    console.log('name'+this.email)
    console.log('name'+this.password)
  }

  async finish() {
    await this.storage.set('tutorialSeen', true);
    this.router.navigateByUrl('/login');
  }

  async register() {
    let loading = await this.loadingCtrl.create({
      message: "Loading...",
    });
    await loading.present();

    this.authService.signUpOnboarding(this.fullName,this.gender,this.address,this.email,this.password).then(
      async (res) => {
        await loading.dismiss();

        let toast = await this.toastCtrl.create({
          duration: 3000,
          message: "Successfully created new Account!",
        });
        toast.present();
        console.log("finished: ", res);
        this.navigateByRole("USER");
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
  navigateByRole(role) {
    if (role == "USER") {
      this.router.navigateByUrl("1/post");
    } else if (role == "ADMIN") {
      this.router.navigateByUrl("1/post");
    }
  }
}
