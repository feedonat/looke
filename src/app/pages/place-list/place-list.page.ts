import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.page.html',
  styleUrls: ['./place-list.page.scss'],
})
export class PlaceListPage implements OnInit {

  constructor(private auth: AuthService, private placeService: PlaceService) { }
  places: Observable<any>;
  ngOnInit() {
    this.places = this.placeService.getAllPlaces();
    console.log("places",this.places)
  }

}
