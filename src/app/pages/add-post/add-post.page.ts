import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  IonSearchbar,
  LoadingController,
  Platform,
  ActionSheetController,
  ToastController,
  AlertController,
} from "@ionic/angular";
import { PostService } from "src/app/services/post.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Observable } from "rxjs";
import { HomePageService } from "src/app/services/home-page.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/services/auth.service";
@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.page.html",
  styleUrls: ["./add-post.page.scss"],
})
export class AddPostPage implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  mainUpload: any;
  categories: Observable<any[]>;
  private poster: any;
  public isUploading = false;
  postForm: FormGroup;
  productImageBase64 = null;
  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private postService: PostService,
    private outhService: AuthService,
    private homePageService: HomePageService
  ) {}
  ngOnInit() {
    this.postForm = this.fb.group({
      postCategory: ["", Validators.required],
      title: ["", [Validators.required]],
      description: ["", Validators.required],
      address: ["", Validators.required],
      img: "",
    });

    this.categories = this.homePageService.getCategories();
    this.poster = this.outhService.getCurrentUser().subscribe((user) => {
      this.poster = user;
    });
  }
  async addPost() {
    const loading = await this.loadingCtrl.create({
      message: 'Saving your Post...',
    });
    await loading.present();
    this.postService.addPost(this.postForm.value, this.poster).then(
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
        this.postForm.patchValue({ img: data });
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
}
