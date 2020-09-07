import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.page.html',
  styleUrls: ['./group-list.page.scss'],
})
export class GroupListPage implements OnInit {

  slideOptsOne = {
    zoom: false,
    slidesPerView: 2.5,
    spaceBetween: -15,
    centeredSlides: true,
    freeMode: true,
  };
  groups: any[];
  allGroups: Observable<any[]>;
  constructor(private groupService : GroupService,
    private router : Router,
    private afAuth : AngularFireAuth) { }

  ngOnInit() {

    this.groupService.getGroups(this.afAuth.auth.currentUser.uid).subscribe(data=>{
      console.log ('GROUP LIST ---------- '+JSON.stringify(data));
      this.groups = data;
    });
    this.allGroups = this.groupService.getAllGroups();
  }

  groupDetail(id) {
    this.router.navigate(
      [`1/group/${id}`],
      { state: { navSettings: { backUrl: '1/group/list' } } });
  }


}
