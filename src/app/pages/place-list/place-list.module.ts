import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceListPageRoutingModule } from './place-list-routing.module';

import { PlaceListPage } from './place-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceListPageRoutingModule
  ],
  declarations: [PlaceListPage]
})
export class PlaceListPageModule {}
