import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController, Platform, ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { HomePageService } from 'src/app/services/home-page.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage implements OnInit {

  @ViewChild('fileInput',{static: false}) fileInput: ElementRef;
  mainUpload:any;
  bannerForm: FormGroup;
  isUploading = false;
  productImageBase64: any;
  constructor(

    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController,
    private homeService: HomePageService) { }
  

  ngOnInit() {

    this.bannerForm = this.fb.group({
      title: ['', [Validators.required]],
      subTitle: ['', [Validators.required]],
      img:''
    });
  }

  async register() {
    let loading = await this.loadingCtrl.create({
      message: "loading..."
    });
    await loading.present();
    this.homeService.addBanner(this.bannerForm.value).then(async res => {
      loading.dismiss();
      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully created new Banner!'
      });
      toast.present();
      console.log('finished: ', res);
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
  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 75,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
    }
    this.camera.getPicture(options).then(data=> {
     console.log(data);
     this.isUploading = true
     this.productImageBase64 = 'data:image/jpeg;base64,' + data;
     this.bannerForm.patchValue({ img: data});
     this.isUploading = false;
    }, (err) => {
      console.log(err);
    });
  }
  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image source",
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

}
