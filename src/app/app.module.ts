import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy, Router } from "@angular/router";
import {
  IonicModule,
  IonicRouteStrategy,
  Events,
  AlertController,
  ToastController,
  LoadingController,
  ModalController,
  Config,
  Platform,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { Preference } from "./services/preference";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthGuardModule } from "@angular/fire/auth-guard";
import { environment } from "src/environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { LoginPageModule } from "./pages/login/login.module";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { Camera } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TabsPageModule } from "./tabs/tabs.module";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { MyProfilePage } from "./pages/my-profile/my-profile.page";
import { MyProfilePageModule } from "./pages/my-profile/my-profile.module";
import { FormControl } from "@angular/forms";
import { Autosize } from './shared/Autosize';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, Autosize ],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    TranslateModule,
    IonicModule.forRoot({
      scrollAssist: false,
      scrollPadding: false,
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    TabsPageModule,
    BrowserModule,
    IonicModule,
    BrowserAnimationsModule,
    AngularFireAuthGuardModule,
  ],

  providers: [
    StatusBar,
    FormControl,
    Camera,
    File,
    InAppBrowser,
    Crop,
    Geolocation,
    SplashScreen,
    LoginPageModule,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private platform: Platform,
    private router: Router,
    private preference: Preference,
    private events: Events,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }
  async initializeApp() {
    if (this.platform.is("desktop")) {
      const config = new Config();
      config.set("rippleEffect", false);
      config.set("animated", false);
    }
    if (this.platform.is("cordova")) {
      await this.platform.ready();
      this.splashScreen.hide();
    }
  }
}
