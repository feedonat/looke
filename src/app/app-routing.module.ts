import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutomaticLoginGuard } from './guards/automatic-login.guard';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RoleGuard } from './guards/role.guard';
import { TabsPage } from './tabs/tabs.page';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);
const routes: Routes = [

{
  path:'home',
  component: TabsPage,
  children:[
  {
    path: 'place',
    canActivate: [AngularFireAuthGuard, RoleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      role: 'USER'
    },
    children: [ 
      {
        path: 'add',
        loadChildren: () => import('./pages/place/place.module').then( m => m.PlacePageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./pages/place-list/place-list.module').then( m => m.PlaceListPageModule)
      },
      {
        path: 'list/:id',
        loadChildren: () => import('./pages/place-detail/place-detail.module').then( m => m.PlaceDetailPageModule)
      },

      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path:'profile',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/my-profile/my-profile.module').then( m => m.MyProfilePageModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  { 
    path: 'tabs', 
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
  path: '', redirectTo: 'tabs', 
  pathMatch: 'full',
  canActivate: [AutomaticLoginGuard]
  }
 ]

}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
