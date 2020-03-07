import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MybusinessPageRoutingModule } from './mybusiness-routing.module';

import { MybusinessPage } from './mybusiness.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MybusinessPageRoutingModule
  ],
  declarations: [MybusinessPage]
})
export class MybusinessPageModule {}
