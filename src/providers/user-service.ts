import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { ImageService } from './image-service';

@Injectable()
export class UserService {
  currentUser: any;
  currentUserGroups = {
    client: true,
    designer: false,
    operator: false,
    admin: false,
  }
  headers: any;
  adminHeaders: any;
  api: any;
  groups = {
    client: {
      name: "Client",
      groupId: 20484,
    },
    designer: {
      name: "Designer",
      groupId: 20488
    },
    operator: {
      name: "Operator",
      groupId: 20492
    }
  }
  
  constructor(private http: Http,
              private storage: Storage,
              private platform: Platform,
              private imageService: ImageService) {
    if (this.platform.is('core')) {
      this.api = '/api';
    } else {
      this.api = 'http://stage.themanhome.com/api/jsonws';
    }
    // this.api = 'http://stage.themanhome.com/api/jsonws';
    // const token = btoa("rorrodev@gmail.com:themanhome2017")
    const token = btoa("manticarodrigo@gmail.com:xlemrotm34711");
    const headers = this.generateHeader(token);
    this.adminHeaders = headers;
    this.fetchGroups();
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
    const endpoint = this.api + "/user/get-user-by-email-address/companyId/20155/emailAddress/" + email;
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
    const endpoint = this.api + "/user/add-user/company-id/20155/auto-password/false/password1/" + password + "/password2/" + password2 + "/auto-screen-name/false/screen-name/" + email.split("@")[0] + "/email-address/" + encodeURIComponent(email) + "/facebook-id/0/-open-id/-locale/first-name/" + firstName + "/-middle-name/last-name/" + lastName + "/prefix-id/0/suffix-id/0/male/true/birthday-month/1/birthday-day/1/birthday-year/1970/-job-title/group-ids/" + [self.groups.client.groupId] + "/-organization-ids/-role-ids/-user-group-ids/send-email/true";
    console.log(endpoint);
    this.http.post(endpoint, null, {headers: this.adminHeaders})
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
    console.log("setting current user and token:");
    console.log(user);
    console.log(token);
    const headers = this.generateHeader(token);
    return new Promise((resolve, reject) => {
      if (user && token) {
        self.headers = headers;
        self.currentUser = user;
        self.setCurrentUserGroups();
        self.checkIfAdmin();
        self.imageForUser(user)
        .then(url => {
          console.log("found user image url:");
          console.log(url);
          if (url) {
            self.currentUser.photoURL = url;
          } else {
            self.currentUser.photoURL = 'assets/user-placeholder.png';
          }
          self.storage.set('user', self.currentUser);
          self.storage.set('token', token);
          resolve(user);
          
        })
        .catch(error => {
          console.log(error);
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

  setCurrentUserGroups() {
    const self = this;
    console.log("setting current user groups");
    for (var name in self.groups) {
      const group = self.groups[name];
      self.hasUserGroup(self.currentUser, group)
      .then(data => {
        if (!data['exception'] && data == true) {
          console.log("current user has group " + group.name);
          self.currentUserGroups[group.name.toLowerCase()] = true;
        }
      });
    }
  }

  checkIfAdmin() {
    const self = this;
    console.log("checking admin role for current user");
    self.getUserRoles(this.currentUser)
    .then(data => {
      if (!data['exception']) {
        for (var key in data) {
          const role = data[key];
          if (role.name == "Administrator") {
            console.log("welcome back " + this.currentUser.firstName + ".");
            console.log("you're an admin, and always remember what liferay says about at admins:");
            console.log(role.descriptionCurrentValue);
            self.currentUser.admin = true;
          }
        }
      }
    });
  }

  imageForUser(user) {
    const self = this;
    const headers = this.headers;
    return new Promise((resolve, reject) => {
      self.imageService.getImage(user.portraitId, headers, (data) => {
        if (data) {
          console.log("adding data to dropdown image");
          console.log(data);
          var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
          if (data.modifiedDate) {
            photoURL = photoURL + '&t=' + data.modifiedDate;
          }
          resolve(photoURL);
        } else {
          console.log("no image found");
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
    const endpoint = this.api + "/user/get-user-by-id/userId/" + uid;
    this.http.get(endpoint, {headers: this.headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("fetched user:");
      console.log(data);
      if (!data.exception) {
        data.shortName = data.firstName;
        if (data.lastName) {
          data.shortName += ' ' + data.lastName.split('')[0] + '.';
        }
      }
      callback(data);
    });
  }

  fetchUsers(uids): Promise<any> {
    console.log("getting users with ids: " + JSON.stringify(uids));
    const self = this;
    var promises = [];
    uids.forEach(uid => {
        if (uid) {
          let promise = new Promise((resolve, reject) => {
              const endpoint = this.api + "/user/get-user-by-id/userId/" + uid;
              self.http.get(endpoint, {headers: self.headers})
              .map(res => res.json())
              .subscribe(data => {
                console.log("fetched user:");
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

  fetchGroups() {
    const self = this;
    const endpoint = this.api + "/group/get-groups/companyId/20155/parentGroupId/0/site/true";
    this.http.get(endpoint, {headers: this.adminHeaders})
    .map(res => res.json())
    .subscribe(data => {
      console.log("fetched groups:");
      console.log(data);
      if (!data.exception) {
        for (var key in data) {
          const group = data[key];
          self.groups[group.name.toLowerCase()] = group;
        }
        console.log(self.groups);
      }
    });
  }

  hasUserGroup(user, group) {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/group/has-user-group/userId/" + user.userId + "/groupId/" + group.groupId;
      this.http.get(endpoint, {headers: this.adminHeaders})
      .map(res => res.json())
      .subscribe(data => {
        console.log(user.firstName + " has group " + group.name);
        console.log(data);
        resolve(data);
      });
    });
  }

  getUserRoles(user) {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/role/get-user-roles/user-id/" + user.userId;
      this.http.get(endpoint, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("user has roles:");
        console.log(data);
        resolve(data);
      });
    });
  }

  updatePortrait(user, bytes, callback) {
    const self = this;
    var headers = this.headers;
    headers.append('Content-Type', 'text/plain; charset=utf-8');
    headers.append("enctype", "multipart/form-data");
    const endpoint = this.api + "/user/update-portrait.2/userId/" + user.userId;
    var formData = new FormData();
    // formData.append('userId', user.userId);
    formData.append('bytes', bytes);
    this.http.post(endpoint, formData, {headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("updated user portrait:");
      console.log(data);
      callback(data);
    });
  }

}