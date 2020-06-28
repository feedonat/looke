import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { Observable, merge } from "rxjs";
import {
  MenuController,
  ModalController,
  IonContent,
  Platform,
  NavController,
  ActionSheetController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { HideHeaderConfig } from "src/app/shared/hide-header.directive";
import { IonicComponentService } from "src/app/services/ionic-component.service";
import { HomePageService } from "src/app/services/home-page.service";
import { PostService } from "src/app/services/post.service";
import { PostDetailPage } from "../post-detail/post-detail.page";
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild("triggerElement", { read: ElementRef, static: true })
  triggerdElement: ElementRef;
  @ViewChild(IonContent, { read: ElementRef, static: true })
  contentArea: ElementRef;

  //Slider configuration
  slideOptsOne = {
    zoom: false,
    slidesPerView: 1,
    spaceBetween: 57,
    centeredSlides: true,
  };

  private observer: IntersectionObserver;
  //********* Observable *********/
  showed = false;
  groups: Observable<any[]>;
  categories: Observable<any[]>;
  promotions: Observable<any[]>;
  recommended: Observable<any[]>;
  banners: Observable<any[]>;
  posts: Observable<any[]>;
  isPaused = false;
  pageSize = 10;
  constructor(
    public homePageService: HomePageService,
    public postService: PostService,
    public menuCtrl: MenuController,
    private navController: NavController,
    public router: Router,
    private renderer: Renderer2,
    private actionSheetCtrl: ActionSheetController,
    private themeSwitcher: ThemeService
  ) { }
  ngOnInit() {
    this.categories = this.homePageService.getCategories();
    this.banners = this.homePageService.getBanners();
    this.posts = this.postService.getPosts(this.pageSize);
  }
  toggleSideMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
  expandCard() {
    console.log("expand Card");
  }

  lovePost(postID) {
    console.log("you like post with id  " + postID);
    this.postService.like(postID);
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





  onLoadMore(event) {
    //console.log("merged posts ---- > "+JSON.stringify(nextData));
  }

  //   async openSearchModal() {
  //     console.log("openModal");
  //     const modal = await this.modalController.create({
  //       component: ShoppingSearchPage,
  //       componentProps: {
  //         //categoryId: categoryId
  //       }
  //     });
  //     return await modal.present();
  //   }
  //   openDetail(url,itemId){
  //     this.router.navigateByUrl('/'+url+'/'+itemId);
  //   }
  // }


  ThemeSwitcher() {
    // 0 = day mode
    // 1 = night mode
    console.log('Swich theme handler');
    if (this.themeSwitcher.currentTheme === 0) {
      this.themeSwitcher.setTheme('night');
      this.themeSwitcher.currentTheme = 1;
      console.log(this.themeSwitcher.currentTheme);
    } else {
      console.log(this.themeSwitcher.currentTheme);
      this.themeSwitcher.setTheme('day');
      this.themeSwitcher.currentTheme = 0;
    }
  }
}
