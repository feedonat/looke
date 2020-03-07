import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MysettingsPage } from './mysettings.page';

const routes: Routes = [
  {
    path: '',
    component: MysettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MysettingsPageRoutingModule {}
