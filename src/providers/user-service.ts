import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(public http: Http) {
    console.log('Hello UserService Provider');
  }

  fetchUser(email) {
    email = encodeURIComponent(email);
    this.http.get("http://stage.themanhome.com/api/jsonws/user/get-user-by-email-address.2/emailAddress/" + email + "?p_auth=[PwkVOXCB]")
    
  }

}
