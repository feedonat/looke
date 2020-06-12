import { HomePageService } from 'src/app/services/home-page.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {

  banners: Observable<any[]>;

  constructor( private homePageService : HomePageService) { }
  ngOnInit() {
    this.banners = this.homePageService.getBanners();
  }

}
