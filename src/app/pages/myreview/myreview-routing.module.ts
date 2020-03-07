import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyreviewPage } from './myreview.page';

const routes: Routes = [
  {
    path: '',
    component: MyreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyreviewPageRoutingModule {}
