import { Component, OnInit } from "@angular/core";
import { Platform, ActionSheetController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { UserServiceService } from "src/app/services/user-service.service";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.page.html",
  styleUrls: ["./user-detail.page.scss"],
})
export class UserDetailPage implements OnInit {
  id = null;
  backUrl = "1/community";
  showToolbar = false;
  showTitle = false;
  transition: boolean = false;
  heartType = null;
  currentUser = null;
  user = null;
  groups: any[];
  posts: Observable<any[]>;
  slideOptsOne = {
    zoom: false,
    slidesPerView: 2.5,
    spaceBetween: -15,
    centeredSlides: true,
    freeMode: true,
  };
  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.showTitle = false;
  }

  ngOnInit() {
    this.backUrl = history.state.navSettings
    ? history.state.navSettings.backUrl
    : this.backUrl;
    this.getUserDetail();
    //this.getUserGroups();

    this.userService.getGroups(this.id).subscribe(data=>{
      console.log ('GROUP LIST ---------- '+JSON.stringify(data));
      this.groups = data;
    });

    this.posts = this.userService.getPosts(this.id)
    this.showTitle = false;
  }

  // getUserGroups(){
  //   this.authService.getCurrentUser().subscribe(x=>{
  //     this.currentUser = x;
  //     console.log('User Detail---groups  = '+JSON.stringify(this.user.groups) );
  //     this.groups =  this.userService.getGroupMembersList(this.user.groups);
  //   });
  // }

  onScroll($event: CustomEvent) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.transition = true;
      this.showToolbar = scrollTop >= 60;
      this.showTitle = scrollTop >= 60;
    } else {
      this.transition = false;
    }
  }

  async getUserDetail() {
    this.user = await this.userService.getOneUser(this.id).subscribe((res) => {
      console.log("user : ", res);
      this.user = res;
      this.user.id = this.id;
    });
  }

  toggleHeart() {
    console.log("calling toggleHeart");
    if (this.heartType == "heart-empty") {
      console.log("Heart ON");

      // this.shoppingService.addWishlist(
      //   this.itemId,
      //   this.itemArray.name,
      //   this.itemArray.rating,
      //   this.itemArray.image
      // );
      // this.postReference.update({
      // 	likes: firestore.FieldValue.arrayUnion(this.user.getUID())
      // })
    } else {
      console.log("Heart OFF");
      // this.shoppingService.removeWishlist(this.itemId);
      // this.postReference.update({
      // 	likes: firestore.FieldValue.arrayRemove(this.user.getUID())
      // })
    }
  }

  groupDetail(id) {
    this.router.navigate(
      [`1/group/${id}`],
      { state: { navSettings: { backUrl: '1/community/' + this.id } } });
  }
  async toggleActionSeet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Action",
      buttons: [
        {
          text: "save post",
          handler: () => {
            console.log('save post ')
            //this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },

        {
          text: "Share post",
          handler: () => {
            console.log('report a post')
            //this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },

        {
          text: "Hide this kind of post",
          handler: () => {
            console.log('report a post')
            //this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "report post",
          handler: () => {
            console.log('report a post')
            //this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  postDetail(id) {
    this.router.navigate(
      [`1/post/${id}`],
      { state: { navSettings: { backUrl: '1/community/' + this.id } } });
  }
  navigateBack() {
    this.router.navigateByUrl(this.backUrl);
  }
}
