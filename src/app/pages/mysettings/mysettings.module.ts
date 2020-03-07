import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MysettingsPageRoutingModule } from './mysettings-routing.module';

import { MysettingsPage } from './mysettings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MysettingsPageRoutingModule
  ],
  declarations: [MysettingsPage]
})
export class MysettingsPageModule {}
