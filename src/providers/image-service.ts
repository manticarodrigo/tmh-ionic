import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ImageService {
  constructor(public http: Http) {
  }

  getImage(id, headers, callback) {
    if (id == 0) {
     callback(null);
    } else {
      const endpoint = "api/image/get-image/imageId/" + id + "?p_auth=[rt4Vaior]";
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
