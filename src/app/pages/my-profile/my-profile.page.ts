import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPage } from '../login/login.page';
import { ModalController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  private loader: any;
  constructor(private outhService : AuthService, protected modalCtrl: ModalController, private loadingCtrl: LoadingController,public navCntr: NavController) { }

  ngOnInit() {
  }

  onLogout() {
    this.outhService.signOut;
  }

  async openSignInModal() {
   this.navCntr.navigateRoot("/home/login")
  
  }
}
