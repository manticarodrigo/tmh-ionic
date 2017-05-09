import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { ImageService } from './image-service';

@Injectable()
export class UserService {
  currentUser: any;
  headers: any;
  api: any;
  secureApi: any;
  
  constructor(private http: Http,
              private storage: Storage,
              private platform: Platform,
              private imageService: ImageService) {
    if (this.platform.is('core')) {
      this.api = '/api';
      this.secureApi = '/api/secure';
    } else {
      this.api = 'http://stage.themanhome.com/api/jsonws';
      this.secureApi = 'http://stage.themanhome.com/api/secure/jsonws';
    }
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
    const endpoint = this.api + "/user/get-user-by-email-address/companyId/20155/emailAddress/" + email + "?p_auth=[PwkVOXCB]";
    this.http.get(endpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("login returned data");
      console.log(data);
      if (!data.exception) {
        self.setCurrentUser(data, token)
        .then(user => {
          callback(user);
        })
        .catch(error => {
          callback(error);
        });
      } else {
        callback(data);
      }
    });
  }

  register(firstName, lastName, email, password, password2, callback) {
    const self = this;
    const token = btoa('manticarodrigo@gmail.com' + ':' + 'xlemrotm34711');
    const headers = this.generateHeader(token);
    const endpoint = this.api + "/user/add-user/company-id/20155/autoPassword/false/password1/" + password + "/password2/" + password2 + "/auto-screen-name/false/screen-name/" + email.split("@")[0] + "/email-address/" + email + "/facebook-id/0/-open-id/-locale/first-name/" + firstName + "/-middle-name/last-name/" + lastName + "/prefix-id/0/suffix-id/0/male/true/birthday-month/1/birthday-day/1/birthday-year/1970/-job-title/-group-ids/-organization-ids/-role-ids/-user-group-ids/send-email/true";
    this.http.post(endpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("register returned data");
      console.log(data);
      if (!data.exception) {
        self.login(email, password, (user) => {
          callback(user);
        });
      } else {
        callback(data);
      }
    });
  }

  setCurrentUser(user, token) {
    const self = this;
    console.log("Setting current user and token:");
    console.log(user);
    console.log(token);
    const headers = this.generateHeader(token);
    return new Promise((resolve, reject) => {
      if (user && token) {
        self.headers = headers;
        self.imageForUser(user)
        .then(url => {
          console.log("Found user image url:");
          console.log(url);
          if (url) {
            user.photoURL = url;
          }
          self.currentUser = user;
          self.storage.set('user', user);
          self.storage.set('token', token);
          resolve(user);
        })
        .catch(error => {
          console.log(error);
          self.currentUser = user;
          self.storage.set('user', user);
          self.storage.set('token', token);
          resolve(user);
        });
      } else {
        self.currentUser = null;
        self.headers = null;
        self.storage.set('user', null);
        self.storage.set('token', null);
        resolve(null);
      }
    });
  }

  imageForUser(user) {
    const self = this;
    const headers = this.headers;
    return new Promise((resolve, reject) => {
      self.imageService.getImage(user.portraitId, headers, (data) => {
        if (data) {
          console.log("Adding data to dropdown image");
          console.log(data);
          var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
          if (data.modifiedDate) {
            photoURL = photoURL + '&t=' + data.modifiedDate;
          }
          resolve(photoURL);
        } else {
          console.log("No image found");
          resolve(null);
        }
      });
    });
  }

  logout() {
    this.setCurrentUser(null, null);
  }

  fetchUser(uid, callback) {
    const self = this;
    const endpoint = this.api + "/user/get-user-by-id/userId/" + uid + "?p_auth=[kgKg7erN]";
    this.http.get(endpoint, {headers: this.headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("Fetched user:");
      console.log(data);
      callback(data);
    })
  }

  fetchUsers(uids): Promise<any> {
      console.log("Getting users with ids: " + JSON.stringify(uids));
      const self = this;
      var promises = [];
      uids.forEach(uid => {
          if (uid) {
            let promise = new Promise((resolve, reject) => {
                const endpoint = this.api + "/user/get-user-by-id/userId/" + uid + "?p_auth=[kgKg7erN]";
                self.http.get(endpoint, {headers: self.headers})
                .map(res => res.json())
                .subscribe(data => {
                  console.log("Fetched user:");
                  console.log(data);
                  if (!data.exception) {
                    data.shortName = data.firstName + ' ' + data.lastName.split('')[0] + '.';
                    resolve(data);
                  } else {
                    resolve(null);
                  }
                })
            });
            promises.push(promise);
          }
      });
      return Promise.all(promises);
    }

}
