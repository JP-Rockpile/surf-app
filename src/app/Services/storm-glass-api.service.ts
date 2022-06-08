import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

var APIkey = 'be0244dc-e68a-11ec-8af0-0242ac130002-be024540-e68a-11ec-8af0-0242ac130002';
var params = 'windSpeed,waveHeight,airTemperature,waterTemperature,windSpeed,visibility,cloudCover'

@Injectable({
  providedIn: 'root'
})
export class StormGlassAPIService {

  constructor() { }

  getSurfReport(lat:number, lng:number) {
    fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
      headers: {
      'Authorization': APIkey
      }
    }).then((response) => response.json()).then((jsonData) => {
    // Do something with response data.
      return jsonData;
    });
  }

}
