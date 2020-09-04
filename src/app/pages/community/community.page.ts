import { HomePageService } from 'src/app/services/home-page.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {

  users: Observable<any[]>;

  constructor( private homePageService : HomePageService,
               private commonService : CommonService) { }
  ngOnInit() {
    this.users = this.commonService.getUserList();
  }

}
