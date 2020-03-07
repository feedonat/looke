import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class LoginPage implements OnInit {
  registerForm : FormGroup;
  loginForm :FormGroup;
  @ViewChild('flipcontainer',{static: false}) flipcontainer: ElementRef;

  constructor(private fb: FormBuilder, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private alertCtrl: AlertController, private router: Router,private authService:AuthService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      name:['',Validators.required],
      role:['USER',Validators.required]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  navigateByRole(role) {
    if (role == 'USER') {
      this.router.navigateByUrl('1/home/place');
    } else if (role == 'ADMIN') {
      this.router.navigateByUrl('1/home/place');
    }
  }

  async login() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await loading.present();

    this.authService.signIn(this.loginForm.value).subscribe(user => {
      loading.dismiss();
      console.log('after login: ', user);
      this.navigateByRole(user['role']);
    },
    async err => {
      loading.dismiss();

      let alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();
    })
  }

  async register() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await loading.present();

    this.authService.signUp(this.registerForm.value).then(async res => {
      await loading.dismiss();

      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully created new Account!'
      });
      toast.present();
      console.log('finished: ', res);
      this.navigateByRole(this.registerForm.value['role']);

    }, async err => {
      await loading.dismiss();

      let alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }
  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle('flip');
  }

}
