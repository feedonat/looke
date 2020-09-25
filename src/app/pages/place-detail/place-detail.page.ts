import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from 'src/app/services/place.service';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  id = null;
  place: any;
  parentPath:any;
  public apiKey: string = environment.googleMapsApiKey;
  images = 5;
  slideOptsOne = {
    zoom: false,
    slidesPerView: 1.8,
    spaceBetween: -35,
    centeredSlides: false,
    freeMode: true,
  };
  picsum: string[] = Array.from(
    new Array(12),
    (x, i) => `https://picsum.photos/1080/720/?${i}`
  );
  slides = [
    {
      id: 1,
      image: '../../assets/images/1.jpg'
    },
    {
      id: 2,
      image: '../../assets/images/2.jpg'
    },
    {
      id: 3,
      image: '../../assets/images/3.jpg'
    },
    {
      id: 4,
      image: '../../assets/images/4.jpg'
    },
    {
      id: 5,
      image: '../../assets/images/5.jpg'
    }
  ];

  //****** image slide  *******/
  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
  };

  //**** toolbar for hide and show ****/
  showToolbar = false;
  showTitle = false;
  transition: boolean = false;
  public reviews: any[] = []; 

  item: Observable<any>;
  itemArray: any=[]; 

  itemRelated: Observable<any>;
  itemOptions: any=[];
  itemSubscribe: any;
 

  itemId: any;
  categoryId: any;

  //**** Size and Color  ****//
  showAttribute1: boolean; // size
  showAttribute2: boolean; // color
  selectedColor: any;
  selectedColorName: any;
  selectedSize: any;


 //relatedPlaces:Observable<any[]>;
  //relatedPlacesArray: any=[];

  //**** User authentication  ****/
  userAuth: boolean = false; // Is user logged in ?
  userId: any;


  //**** favorite  ****/
  favorite: boolean = false;
  favArray: any;
	heartType: string = "heart-outline";
  
  constructor( private platform : Platform ,
    private route: ActivatedRoute, 
    private placeService: PlaceService,
    private statusBar: StatusBar) { 
    this.id = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    await this.getPlaceDetail();
  }
    onScroll($event: CustomEvent) {
      if ($event && $event.detail && $event.detail.scrollTop) {
        const scrollTop = $event.detail.scrollTop;
        this.transition = true;
        this.showToolbar = scrollTop >= 60;
        //console.log("showToolbar="+this.showToolbar);
        this.showTitle = scrollTop >= 60;
        //console.log("showTitle="+this.showTitle);
      }else{
        this.transition = false;
      }
    }

    async getPlaceDetail() {
      this.place = await this.placeService.getOnePlace(this.id).subscribe(res => {
        console.log('my place: ', res);
        this.place = res;
        this.place.id = this.id;
      });
    }
    setupStatusBar() {
      if (this.platform.is('ios')) {
        this.statusBar.overlaysWebView(true);
        this.statusBar.styleDefault();
      } else {
        this.statusBar.backgroundColorByHexString(environment.androidHeaderColor);
      }
    }

    toggleHeart() {
      console.log("calling toggleHeart");
      if(this.heartType == 'heart-empty') {
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

    async onDirectionsButtonTouched() {

      const lat = this.place.location.latitude;
      const lng = this.place.location.longitude;
  
      const url = `https://maps.google.com/maps?q=${lat},${lng}`;
     // this.openSimpleUrl(url);
    }
  }
