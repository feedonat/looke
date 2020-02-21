
import { Component, OnInit,EventEmitter, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController, AlertController, Platform, ActionSheetController, IonSearchbar } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlaceService } from 'src/app/services/place.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { environment } from 'src/environments/environment';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { MapStyle } from 'src/app/services/map-style';
@Component({
  selector: 'app-place',
  templateUrl: './place.page.html',
  styleUrls: ['./place.page.scss'],
})
export class PlacePage implements OnInit {
  @ViewChild('fileInput',{static: false}) fileInput: ElementRef;
  mainUpload:any;
  private eventFileUpload: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild(IonSearchbar,{static:false}) searchBar: IonSearchbar;
  private location: { lat?: number, lng?: number } = {};
  protected map: google.maps.Map;
  protected geocoder: google.maps.Geocoder;
  protected marker: google.maps.Marker;
  protected autocompleteService: google.maps.places.AutocompleteService;
  protected placesService: google.maps.places.PlacesService;
  protected mapInitialised: boolean = false;
  public suggestions: any = [];
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
    private zone: NgZone,
    private geolocationService: GeolocationService,
    private placeService: PlaceService) { }
    private target;
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
    this.loadGoogleMaps();

  }

  ionViewWillEnter() {
    //this.loadGoogleMaps();
    //this.loadUserPosition();
  }


  async register() {
    let loading = await this.loadingCtrl.create({
      message: "loading..."
    });
    await loading.present();
    this.placeService.addPlace(this.placeForm.value,this.location).then(async res => {
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

  async loadGoogleMaps() {
    window['mapInit'] = () => {
      this.initMap();
    }
    const apiKey = environment.googleMapsApiKey;
    let script = document.createElement('script');
    script.id = 'googleMaps';
    script.src = `https://maps.google.com/maps/api/js?key=${apiKey}&callback=mapInit&libraries=places`;
    document.body.appendChild(script);

  }

  async initMap() {

    this.geocoder = new google.maps.Geocoder();
    this.mapInitialised = true;

    const mapOptions: any = {
      styles: MapStyle.standard(),
      zoom: 2,
      center: {lat: 0, lng: 0},
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.addListener(this.map, 'drag', () => {
      const center = this.map.getCenter();
      this.setMarkerPosition(center);
      this.location.lat = center.lat();
      this.location.lng = center.lng();
      this.geocoder.geocode({ location: center }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
           this.target = results[0];
          
        }
      });

    });
   
    google.maps.event.addListener(this.map, 'dragstart', () => {
      this.toggleMarker();
    });


    google.maps.event.addListener(this.map, 'dragend', () => {
      this.searchBar.value = this.target.formatted_address;
      this.markerDrop();
    });


    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(this.map);
    
    try {
      const coords = await this.geolocationService.getCurrentPosition();
      if (!coords) {
        return 'ERROR_LOCATION_UNAVAILABLE';
       // .subscribe(str => this.showToast(str));
      }

      this.location.lat = coords.latitude;
      this.location.lng = coords.longitude;
      this.setMarkerPosition(this.location);
      this.map.panTo({
        lat: coords.latitude,
        lng: coords.longitude
      });
      this.map.setZoom(15);

    } catch (err) {
      
    }
  }
  toggleMarker() {
      this.marker.setAnimation(3);
  }
    markerDrop() {
        this.marker.setAnimation(4);
  }

  setMarkerPosition(position: any) {
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        icon: {
          url: './assets/img/pin.png',
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        },
        position: position,
        map: this.map,
      });
      this.marker.setAnimation(4);
      
    } else {
      this.marker.setPosition(position);
    }
  }

  onSuggestionTouched(suggestion: any) {

    if (!this.mapInitialised) return;
    this.suggestions = [];
    this.placesService.getDetails({ placeId: suggestion.place_id }, (details: any) => {
      this.zone.run(() => {
        const location = details.geometry.location;
        this.searchBar.value = details.formatted_address;
        this.setMarkerPosition(location);
        this.map.panTo(location);
        this.map.setZoom(15);
        this.location.lat = location.lat();
        this.location.lng = location.lng();
      });

    });

  }

  onSearchAddress(event: any = {}) {
    if (!this.mapInitialised) return;
    const query = event.target.value;
    if (query && query.length >= 3) {
      const config = {
        input: query,
        types: ['geocode'],
      };
      this.autocompleteService.getPlacePredictions(config, (predictions: any) => {
        this.zone.run(() => {
          if (predictions) this.suggestions = predictions;
        });
      });

    }
  }

}