import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyreviewPageRoutingModule } from './myreview-routing.module';

import { MyreviewPage } from './myreview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyreviewPageRoutingModule
  ],
  declarations: [MyreviewPage]
})
export class MyreviewPageModule {}
