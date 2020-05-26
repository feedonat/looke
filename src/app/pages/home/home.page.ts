import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { Observable } from "rxjs";
import {
  MenuController,
  ModalController,
  IonContent,
  Platform,
  NavController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { HideHeaderConfig } from "src/app/shared/hide-header.directive";
import { IonicComponentService } from "src/app/services/ionic-component.service";
import { HomePageService } from "src/app/services/home-page.service";
import { PostService } from "src/app/services/post.service";
import { PostDetailPage } from "../post-detail/post-detail.page";

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
    initialSlide: 1,
    slidesPerView: 1,
    autoplay: true,
  };
  // ******** for Cart ***********//
  cart = [];

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
  constructor(
    public homePageService: HomePageService,
    public postService: PostService,
    public menuCtrl: MenuController,
    private navController: NavController,
    public router: Router,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    this.categories = this.homePageService.getCategories();
    this.banners = this.homePageService.getBanners();
    this.posts = this.postService.getPosts();
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
   // this.renderer.addClass(this.heart.nativeElement, 'is_animating');
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
}
