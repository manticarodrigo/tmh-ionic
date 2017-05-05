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

  generateHeader(token) {
    const headers = new Headers();
    var authHeader = `Basic ${token}`;
    headers.append('Authorization', authHeader);
    return headers;
  }

  login(email, password, callback) {
    const self = this;
    const token = btoa(email + ':' + password);
    const headers = this.generateHeader(token);
    const enpoint = "/api/user/get-user-by-email-address/companyId/20155/emailAddress/" + email + "?p_auth=[PwkVOXCB]";
    this.http.get(enpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      self.setCurrentUser(data, token);
      callback(data);
    })
  }

  setCurrentUser(user, token) {
    console.log("Setting current user and token:");
    console.log(user);
    const headers = this.generateHeader(token);
    console.log(headers);
    this.currentUser = user;
    this.headers = headers;
    this.storage.set('user', user);
    this.storage.set('token', token);
  }

  logout() {
    this.setCurrentUser(null, null);
  }

  fetchUser(email, callback) {
    const self = this;
    const enpoint = "/api/user/get-user-by-email-address/companyId/20155/emailAddress/" + email + "?p_auth=[PwkVOXCB]";
    this.http.get(enpoint, {headers: this.headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("Fetched user:");
      console.log(data);
      callback(data);
    }) 
  }

}
