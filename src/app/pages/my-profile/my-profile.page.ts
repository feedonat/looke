import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPage } from '../login/login.page';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  private loader: any;
  private user :any;
  constructor(private outhService : AuthService,
     protected modalCtrl: ModalController, 
     private loadingCtrl: LoadingController,
     private navCntr: NavController,
     private router: Router) { }

  enableMenuSwipe() {
    return true;
  }

  ngOnInit() {
    this.user = this.outhService.getCurrentUser().subscribe(user=>{
      this.user = user;
    });
    console.log("user>>> "+this.user['name'])
  }

  onLogout() {
    this.outhService.signOut;
    this.user = null;
    this.navCntr.navigateRoot("/login")
  }

  async openSignInModal() {
   this.navCntr.navigateRoot("1/profile/login")
  }
  async mySettings() {
    this.navCntr.navigateRoot("1/profile/mySettings")
   }
   async myLikes() {
    this.navCntr.navigateRoot("1/profile/myLikes")
   }
   async myReview() {
    this.navCntr.navigateRoot("1/profile/myReview")
   }
   async myBusiness() {
    this.navCntr.navigateRoot("1/profile/myBusiness")
   }
   async changePassword() {
    this.navCntr.navigateRoot("1/profile/changePassword")
   }

  async onPresentEditModal(user) {

    let navigationExtras: NavigationExtras= {
      state: {
        user: user
      }
    };
    this.router.navigate(['1/profile/edit'], navigationExtras);
  }

}
