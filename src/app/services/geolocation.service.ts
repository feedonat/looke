import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, Coordinates } from '@ionic-native/geolocation/ngx';
import { firestore } from 'firebase';
//import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private lastPosition: Geoposition;

  constructor(private geolocation: Geolocation) {}

  async getCurrentPosition(): Promise<Coordinates> {

    let position = null;

    if (this.lastPosition) {
      const diff = new Date().getTime() - this.lastPosition.timestamp;
      const minutesDifference = Math.floor(diff / 1000 / 60);
      if (minutesDifference <= 15) return this.lastPosition.coords;
    }

    try {

      const options: GeolocationOptions = {
        enableHighAccuracy: false,
        timeout: 5000, // 5 sec
        maximumAge: 15 * 60 * 1000, // 15 minutes
      };

      position = await this.geolocation.getCurrentPosition(options);
      this.lastPosition = position;
    } catch (error) {
      position = this.lastPosition;
    }

    return position ? position.coords : null;

  }

  toParseGeoPoint(coords: Coordinates): firebase.firestore.GeoPoint {
    return  new firestore.GeoPoint(coords.latitude, coords.longitude)
  }
}
