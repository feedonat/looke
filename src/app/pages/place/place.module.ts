import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlacePageRoutingModule } from './place-routing.module';
import { PlacePage } from './place.page';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PlacePage]
})
export class PlacePageModule {}
