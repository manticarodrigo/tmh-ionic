import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';
import { ENV } from '@env';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  // TODO: remove user service vars
  currentUser: any;
  headers: any;
  api: any;
  
  constructor(
    private http: Http,
    private storage: Storage
  ) {}

  getHeaders() {
    const headers = new Headers();
    const authHeader = `Token ${this.currentUser.token}`;
    headers.append('Authorization', authHeader);
    return headers;
  }

  fetchCurrentUser() {
    return new Observable(observer => {
      if (this.currentUser) {
        observer.next(this.currentUser);
      } else {
        this.storage.get('user')
          .then(user => {
            observer.next(user ? this.setCurrentUser(user) : null);
          });
      }
    });
  }

  setCurrentUser(user) {
    console.log('setting current user:', user);
    this.currentUser = user ? user : null;
    this.storage.set('user', user ? user: null);
    return user ? user: null;
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.storage.clear()
        .then(() => {
          this.currentUser = null;
          resolve(true);
        });
    });
  }

  login(username, password, callback) {
    this.http.post(
      `${ENV.backendUrl}/api-token-auth/`,
      {
        username,
        password
      }
    )
      .map(res => res.json())
      .subscribe(
        res => {
          console.log(res);
          callback(res);
        },
        err => {
          console.log(err);
          callback(null);
        }
    );
  }

  register(username, password, first_name, last_name, email) {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${ENV.backendUrl}/api/v1/users/`,
        {
          username,
          password,
          first_name,
          last_name,
          email
        }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log(res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  facebookAuth(token) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.http.post(
        `${ENV.backendUrl}/rest-auth/facebook/`,
        { access_token: token }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log(res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  fetchUser(uid) {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId] = /user/get-user-by-id": {
          "companyId": "20155",
          "userId": uid,
          "$image[modifiedDate] = /image/get-image": {
            "@imageId": "$user.portraitId"
          },
          "$roles[name] = /role/get-user-roles": {
            "@userId": "$user.userId"
          },
          "$client = /group/has-user-group": {
            "@userId": "$user.userId",
            "groupId": 20484
          },
          "$designer = /group/has-user-group": {
            "@userId": "$user.userId",
            "groupId": 20488
          },
          "$operator = /group/has-user-group": {
            "@userId": "$user.userId",
            "groupId": 20492
          }
        }
      }
      const endpoint = ENV.backendUrl + "/invoke?cmd=" + JSON.stringify(map);
      this.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(user => {
        console.log("fetched user:");
        console.log(user);
        if (!user.exception) {
          user.shortName = user.firstName;
          if (user.lastName) {
            user.shortName += ' ' + user.lastName.split('')[0] + '.';
          }
          var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
          if (user.image) {
            user.photoURL = photoURL + '&t=' + user.image.modifiedDate;
          }
          delete user.image;
          for (var key in user.roles) {
            const role = user.roles[key];
            if (role.name == "Administrator") {
              user.admin = true;
            }
          }
          delete user.roles;
        }
        resolve(user);
      });
    });
  }

  fetchUsers(uids): Promise<any> {
    console.log("getting users with ids: " + JSON.stringify(uids));
    const self = this;
    var promises = [];
    uids.forEach(uid => {
        if (uid) {
          promises.push(self.fetchUser(uid));
        }
    });
    return Promise.all(promises);
  }

  updatePortrait(user, bytes, callback) {
    const self = this;
    var headers = this.headers;
    headers.append("enctype", "multipart/form-data");
    const endpoint = ENV.backendUrl + "/user/update-portrait.2/userId/" + user.userId;
    var formData = new FormData();
    formData.append('bytes', bytes);
    this.http.post(endpoint, formData, {headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("updated user portrait:");
      console.log(data);
      callback(data);
    });
  }

  fetchCreditCard(user) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("fetching credit card for user:");
      console.log(user);
      const endpoint = ENV.backendUrl + "/tmh-project-portlet.usercreditcard/fetch-by-user-id/userId/" + user.userId;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found user credit card:");
        console.log(data);
        resolve(data);
      });
    });
  }

  updateUser(user) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating user:");
      console.log(user);
      const map = {
        "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId] = /tmh-project-portlet.project/update-user": {
          "userId": user.userId,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "emailAddress": user.emailAddress,
          "$image[modifiedDate] = /image/get-image": {
            "@imageId": "$user.portraitId"
          },
          "$roles[name] = /role/get-user-roles": {
            "@userId": "$user.userId"
          },
          "$client = /group/has-user-group": {
            "@userId": "$user.userId",
            "groupId": 20484
          },
          "$designer = /group/has-user-group": {
            "@userId": "$user.userId",
            "groupId": 20488
          },
          "$operator = /group/has-user-group": {
            "@userId": "$user.userId",
            "groupId": 20492
          }
        }
      }
      const endpoint = ENV.backendUrl + "/invoke?cmd=" + JSON.stringify(map);
      console.log(endpoint);
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(user => {
        console.log("updated user data:");
        console.log(user);
        if (!user.exception) {
          user.shortName = user.firstName;
          if (user.lastName) {
            user.shortName += ' ' + user.lastName.split('')[0] + '.';
          }
          var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
          if (user.image) {
            user.photoURL = photoURL + '&t=' + user.image.modifiedDate;
          }
          delete user.image;
          for (var key in user.roles) {
            const role = user.roles[key];
            if (role.name == "Administrator") {
              user.admin = true;
            }
          }
          delete user.roles;
        }
        resolve(user);
      });
    });
  }
  
}