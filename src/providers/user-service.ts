import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {
  currentUser: any;
  headers: any;
  constructor(private http: Http,
              private storage: Storage) {
  }

  login(email, password, callback) {
    const self = this;
    const headers = new Headers();
    var authData = btoa(email + ':' + password);
    var authHeader = `Basic ${authData}`;
    headers.append('Authorization', authHeader);
    const url = "http://stage.themanhome.com/api/jsonws/user/get-user-by-email-address/companyId/20155/emailAddress/" + email + "?p_auth=[PwkVOXCB]";
    this.http.get(url, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      self.setCurrentUser(data, headers);
      callback(data);
    })
  }

  setCurrentUser(user, headers) {
    console.log("Setting current user:");
    console.log(user);
    this.currentUser = user;
    this.headers = headers;
    this.storage.set('user', user);
  }

  fetchUser(email, callback) {
    const self = this;
    const url = "http://stage.themanhome.com/api/jsonws/user/get-user-by-email-address/companyId/20155/emailAddress/" + email + "?p_auth=[PwkVOXCB]";
    this.http.get(url, {headers: this.headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("Fetched user:");
      console.log(data);
      callback(data);
    }) 
  }

}
