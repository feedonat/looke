import { Component, OnInit,EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController, AlertController, Platform, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlaceService } from 'src/app/services/place.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
@Component({
  selector: 'app-place',
  templateUrl: './place.page.html',
  styleUrls: ['./place.page.scss'],
})
export class PlacePage implements OnInit {
  @ViewChild('fileInput',{static: false}) fileInput: ElementRef;
  mainUpload:any;
  private eventFileUpload: EventEmitter<File> = new EventEmitter<File>();

  croppedImagepath = "";
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  public isUploading: boolean = false;
  placeForm: FormGroup
  productImageBase64 = null;
  constructor(private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController,
    private router: Router,
    private file:File,
    private crop: Crop,
    private placeService: PlaceService) { }

  ngOnInit() {
    this.placeForm = this.fb.group({
      businessCategory: ['', Validators.required],
      name: ['', [Validators.required]],
      description: ['', Validators.required],
      address: ['', Validators.required],
      website: ['', Validators.required],
      phone: ['', Validators.required],
      img:''
    });
  }
  async register() {
    let loading = await this.loadingCtrl.create({
      message: "loading..."
    });
    await loading.present();
    this.placeService.addPlace(this.placeForm.value).then(async res => {
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
     this.placeForm.patchValue({ img: data })
     this.isUploading = false;
    }, (err) => {
      console.log(err)
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
