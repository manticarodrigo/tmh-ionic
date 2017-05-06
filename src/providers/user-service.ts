import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { ImageService } from './image-service';

@Injectable()
export class UserService {
  currentUser: any;
  headers: any;
  constructor(private http: Http,
              private storage: Storage,
              private imageService: ImageService) {
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
    const self = this;
    console.log("Setting current user and token:");
    console.log(user);
    const headers = this.generateHeader(token);
    console.log(headers);
    if (user && token) {
      self.imageForUser(user)
      .then(url => {
        user.photoURL = url;
        self.currentUser = user;
        self.headers = headers;
        self.storage.set('user', user);
        self.storage.set('token', token);
      })
      .catch(error => {
        console.log(error);
        self.currentUser = user;
        self.headers = headers;
        self.storage.set('user', user);
        self.storage.set('token', token);
      });
    } else {
      self.currentUser = null;
      self.headers = null;
      self.storage.set('user', null);
      self.storage.set('token', null);
    }
  }

  imageForUser(user) {
    const self = this;
    const headers = this.headers;
    return new Promise((resolve, reject) => {
      self.imageService.getImage(user.portraitId, headers, (data) => {
        if (data) {
          console.log("Adding data to dropdown image");
          console.log(data);
          const photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId + '&t=' + data.modifiedDate;
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
    const enpoint = "/api/user/get-user-by-id/userId/" + uid + "?p_auth=[kgKg7erN]";
    this.http.get(enpoint, {headers: this.headers})
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
                const enpoint = "/api/user/get-user-by-id/userId/" + uid + "?p_auth=[kgKg7erN]";
                self.http.get(enpoint, {headers: self.headers})
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
