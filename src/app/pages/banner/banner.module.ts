import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BannerPageRoutingModule } from './banner-routing.module';

import { BannerPage } from './banner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BannerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [BannerPage]
})
export class BannerPageModule {}
