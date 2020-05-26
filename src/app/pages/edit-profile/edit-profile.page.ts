import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, NavController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  private user: any;
  public profileForm: FormGroup;
  isUploading = false;
  profileImageBase64 = null;

  constructor(private outhService: AuthService,
              private fb: FormBuilder,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private router: Router,
              private camera: Camera,
              private actionSheetCtrl: ActionSheetController) {

    this.user = this.outhService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
    console.log('user>>> ' + this.user.name);
  }

  ngOnInit() {

    this.profileForm = this.fb.group({
      name:  ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      img: ''
    });
  }

  async updateProfile() {

    const loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await loading.present();

    this.outhService.updateProfiel(this.profileForm.value);
    loading.dismiss();
    const toast =  await this.toastCtrl.create({
      duration: 3000,
      message: 'Successfully updated your Profile!'
    });
    toast.present();
    this.router.navigateByUrl('1/profile');
  }

  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  pickImage(source) {
    const options: CameraOptions = {
      quality: 70,
      sourceType: source,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
    }
    this.camera.getPicture(options).then(data => {
     console.log(data);
     this.isUploading = true;
     this.profileImageBase64 = 'data:image/jpeg;base64,' + data;
     this.profileForm.patchValue({ img: data });
     this.isUploading = false;
    }, (err) => {
      console.log(err);
    });
  }

}
