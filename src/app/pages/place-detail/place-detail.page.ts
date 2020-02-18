import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  id=null;
  place=null;
  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.placeService.getOnePlace(this.id).subscribe(res => {
      console.log('my place: ', res);
      this.place = res;
      this.place.id = this.id;
    });
  }



}
