import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

@Injectable()
export class ImageService {
  api: any;

  constructor(private http: Http,
              private platform: Platform) {
    if (this.platform.is('core')) {
      this.api = '/api'
    } else {
      this.api = 'http://stage.themanhome.com/api/jsonws'
    }
  }

  getImage(id, headers, callback) {
    if (id == 0) {
     callback(null);
    } else {
      const endpoint = this.api + "/image/get-image/imageId/" + id + "?p_auth=[rt4Vaior]";
      this.http.get(endpoint, {headers: headers})
      .map(res => res.json())
      .subscribe(img => {
        console.log("Found image:");
        console.log(img);
        callback(img);
      })
    }
  }
}