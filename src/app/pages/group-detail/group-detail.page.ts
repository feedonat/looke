import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { PostService } from "src/app/services/post.service";
import { GroupService } from "src/app/services/group.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { inspect } from "util"; // or directly
import { Location } from "@angular/common";
import { CommonService } from "src/app/services/common.service";
@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.page.html",
  styleUrls: ["./group-detail.page.scss"],
})
export class GroupDetailPage implements OnInit {
  private backUrl = "/1/post";
  private id = null;
  private limit;
  private group = null;
  private members;
  private isMember = false;
  private memberList = [];
  private currentUser = null;
  private memberCount = 0;
  slideOptsOne = {
    zoom: false,
    slidesPerView: 10,
    spaceBetween: -30,
    centeredSlides: false,
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private commonService: CommonService
  ) {}

  async ngOnInit() {
    this.backUrl = history.state.navSettings
      ? history.state.navSettings.backUrl
      : this.backUrl;
    this.id = this.route.snapshot.paramMap.get("id");
    console.log("postID ngoninit " + this.id);
    await this.getGroupDetail();
    console.log("Is the user already member ???? " + this.isMember);
  }

  async getMembers(limit) {
    console.log("group IDDDDD  " + this.id);
    this.groupService.getGroupMembers(this.id,limit).subscribe((data) => {
      console.log('members list detail DDDDDDD  = ' + JSON.stringify(data));
      this.members = data;
    });
  }

  async getGroupDetail() {
    this.group = this.groupService
      .getOneGroup(this.id)
      .subscribe((res: any) => {
        const currentUser = this.afAuth.auth.currentUser.uid;
        console.log('current user = ' + currentUser);
        this.group = res;
        const memberCount = res.count;
        this.limit = memberCount <= 7 ? memberCount : 5;
        this.memberCount = memberCount > 7 ? memberCount - 5 : 0;
        this.getMembers(this.limit);
        this.isMember = res.memberArr.indexOf(currentUser) > -1;
        console.log('Members ----,.... = ' + JSON.stringify(this.members));
        console.log('Group Detail  ========= ' + JSON.stringify(res));
      });
  }
  joinGroup() {
    this.groupService
      .joinGroup(this.afAuth.auth.currentUser.uid, this.id, this.group.isPuplic)
      .then(async (x) => {
        const toast = await this.toastCtrl.create({
          duration: 3000,
          message: "You Joined The Group !",
        });
        // increament the member counter
        this.commonService.increamentCounter("groups", this.id);
        toast.present();
        this.ngOnInit();
      });
  }

  backClick() {
    this.router.navigateByUrl(this.backUrl);
  }
}
