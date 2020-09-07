import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoadingController, ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GroupService } from 'src/app/services/group.service';
@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  mainUpload: any;
  isToggled = false;
  isPuplic = false;
  categories: Observable<any[]>;
  private poster: any;
  public isUploading = false;
  addGroupForm: FormGroup;
  productImageBase64 = null;
  constructor( private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private outhService: AuthService,
    private groupService : GroupService) { }

  ngOnInit() {
    this.addGroupForm = this.fb.group({
      groupCategory: ["", Validators.required],
      groupName: ["", [Validators.required]],
      desc: ["", Validators.required],
      coverImg: "",
      isPuplic: this.isPuplic
    });
    this.categories = this.groupService.getCategories();
    this.poster = this.outhService.getCurrentUser().subscribe((user) => {
      this.poster = user;
    });
}

  async createGroup() {
    const loading = await this.loadingCtrl.create({
      message: 'Saving your Post...',
    });
    await loading.present();
    this.groupService.addGroup(this.addGroupForm.value, this.poster).then(
      async (res) => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          duration: 3000,
          message: 'Successfully created new Post!',
        });
        toast.present();
        console.log("finished: ", res);
      },
      async (err) => {
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: "Error",
          message: err.message,
          buttons: ["OK"],
        });
        alert.present();
      }
    );
  }

  pickImage(type) {
    const options: CameraOptions = {
      quality: 70,
      sourceType: type,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
    };
    this.camera.getPicture(options).then(
      (data) => {
        console.log(data);
        this.isUploading = true;
        this.productImageBase64 = "data:image/jpeg;base64," + data;
        this.addGroupForm.patchValue({ coverImg: data });
        this.isUploading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  public notify() {
   this.isPuplic = this.isToggled;
  }
}
