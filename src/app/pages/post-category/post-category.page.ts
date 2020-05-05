import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { LoadingController, Platform, ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HomePageService } from 'src/app/services/home-page.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.page.html',
  styleUrls: ['./post-category.page.scss'],
})
export class PostCategoryPage implements OnInit {

  @ViewChild('fileInput',{static: false}) fileInput: ElementRef;
  mainUpload:any;
  categoryForm: FormGroup;
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

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      img:''
    });
  }

  async register() {
    let loading = await this.loadingCtrl.create({
      message: "loading..."
    });
    await loading.present();
    this.homeService.addPostCategory(this.categoryForm.value).then(async res => {
      loading.dismiss();
      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully created new Business!'
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
      quality: 70,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(data=> {
     console.log(data);
     this.isUploading = true
     this.productImageBase64 = 'data:image/jpeg;base64,' + data;
     this.categoryForm.patchValue({ img: data});
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
