import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { AutomaticLoginGuard } from './guards/automatic-login.guard';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RoleGuard } from './guards/role.guard';
import { TabsPage } from './tabs/tabs.page';
import { HomePage } from './pages/home/home.page';
import { MyProfilePage } from './pages/my-profile/my-profile.page';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/1/profile/login']);
const routes: Routes = [
{
   path: '1',
    component: TabsPage,
    children: [

  {
    path:'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'place',
        loadChildren: () => import('./pages/place/place.module').then( m => m.PlacePageModule)
      }

    ]
  },
  
   {
    path: 'place',
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
      },
      
      {
        path: 'edit',
        loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
      },
      {
        path: 'myBusiness',
        loadChildren: () => import('./pages/mybusiness/mybusiness.module').then( m => m.MybusinessPageModule)
      },
      {
        path: 'myLikes',
        loadChildren: () => import('./pages/mylikes/mylikes.module').then( m => m.MylikesPageModule)
      },
      {
        path: 'myReview',
        loadChildren: () => import('./pages/myreview/myreview.module').then( m => m.MyreviewPageModule)
      },
      {
        path: 'changePassword',
        loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
      },
      {
        path: 'mySettings',
        loadChildren: () => import('./pages/mysettings/mysettings.module').then( m => m.MysettingsPageModule)
      }

    ]
  },
  
  {
    path: '',
    redirectTo: '/1/home',
    pathMatch: 'full'
  }
    ]
},
 
{
  path: 'login',
  loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
},

{
  path: '',
  redirectTo: '/1/home',
  pathMatch: 'full'
},
  
 ];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
