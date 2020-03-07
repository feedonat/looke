import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MylikesPageRoutingModule } from './mylikes-routing.module';

import { MylikesPage } from './mylikes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MylikesPageRoutingModule
  ],
  declarations: [MylikesPage]
})
export class MylikesPageModule {}
