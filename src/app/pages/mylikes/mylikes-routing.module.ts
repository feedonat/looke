import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MylikesPage } from './mylikes.page';

const routes: Routes = [
  {
    path: '',
    component: MylikesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MylikesPageRoutingModule {}
