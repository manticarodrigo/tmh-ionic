import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserService {
  currentUser: any;
  headers: any;
  api = 'http://stage.themanhome.com/api/jsonws';
  
  constructor(private http: Http,
              private storage: Storage) {
    this.api = '/api';
    const token = btoa("manticarodrigo@gmail.com:xlemrotm34711");
    const headers = this.generateHeaders(token);
    this.headers = headers;
    this.fetchCurrentUser();
  }

  generateHeaders(token) {
    const headers = new Headers();
    var authHeader = `Basic ${token}`;
    headers.append('Authorization', authHeader);
    return headers;
  }

  fetchCurrentUser() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.currentUser) {
        resolve(self.currentUser);
      } else {
        this.storage.get('user')
        .then(user => {
          if (!user) {
            console.log('No stored user found');
            console.log(user);
            resolve(null);
          } else {
            console.log('Stored user found');
            self.setCurrentUser(user)
            .then(user => {
              resolve(user);
            })
            .catch(error => {
              console.log(error);
            });
          }
        });
      }
    });
  }

  setCurrentUser(user) {
    const self = this;
    console.log("setting current user:");
    console.log(user);
    return new Promise((resolve, reject) => {
      if (user) {
        self.currentUser = user;
        self.storage.set('user', user);
        resolve(user);
      } else {
        self.currentUser = null;
        self.storage.set('user', null);
        resolve(null);
      }
    });
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

  login(email, password, callback) {
    const self = this;
    const token = btoa(email + ':' + password);
    const headers = this.generateHeaders(token);
    const map = {
      "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId] = /user/get-user-by-email-address": {
        "companyId": "20155",
        "emailAddress": email,
        "$image[modifiedDate] = /image/get-image": {
          "@imageId": "$user.portraitId"
        },
        "$roles[name,descriptionCurrentValue] = /role/get-user-roles": {
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
    const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
    this.http.get(endpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(user => {
      console.log("login returned data");
      console.log(user);
      if (!user.exception) {
        var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
        if (user.image) {
          user.photoURL = photoURL + '&t=' + user.image.modifiedDate;
        }
        delete user.image;
        for (var key in user.roles) {
          const role = user.roles[key];
          if (role.name == "Administrator") {
            console.log("welcome back " + user.firstName + ".");
            console.log("you're an admin, and always remember what liferay says about at admins:");
            console.log(role.descriptionCurrentValue);
            user.admin = true;
          }
        }
        delete user.roles;
      }
      callback(user);
    });
  }

  fetchUserByFacebookId(id) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("fetching user by facebook id:");
      console.log(id);
      const map = {
        "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId] = /tmh-project-portlet.project/find-user-by-facebook-id": {
          "companyId": 20155,
          "facebookId": id,
          "$image[modifiedDate] = /image/get-image": {
            "@imageId": "$user.portraitId"
          },
          "$roles[name,descriptionCurrentValue] = /role/get-user-roles": {
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(user => {
        console.log("facebook user fetch returned response:");
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

  fetchUserByEmail(email) {
    const self = this;
    console.log("fetching user by email address:");
    console.log(email);
    return new Promise((resolve, reject) => {
      const map = {
        "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId,screenName] = /user/get-user-by-email-address": {
          "companyId": 20155,
          "emailAddress": email,
          "$image[modifiedDate] = /image/get-image": {
            "@imageId": "$user.portraitId"
          },
          "$roles[name,descriptionCurrentValue] = /role/get-user-roles": {
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
      const endpoint = self.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(user => {
        console.log("email user fetch returned response:");
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

  updateUserFacebookId(user, facebookId) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating user facebook id:");
      console.log(user);
      const map = {
        "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId] = /tmh-project-portlet.project/update-user-facebook-id": {
          "userId": user.userId,
          "facebookId": facebookId,
          "$image[modifiedDate] = /image/get-image": {
            "@imageId": "$user.portraitId"
          },
          "$roles[name,descriptionCurrentValue] = /role/get-user-roles": {
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(user => {
        console.log("user facebookId update returned response:");
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

  facebookRegister(data) {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$user[firstName,lastName,emailAddress,portraitId,userId,createDate,facebookId] = /user/add-user.26": {
          "autoPassword": true,
          "auto-screen-name": true,
          "emailAddress": data.email,
          "facebookId": data.id,
          "firstName": data.first_name,
          "lastName": data.last_name ? data.last_name : "",
          "prefixId": 0,
          "suffixId": 0,
          "male": true,
          "birthdayMonth": 1,
          "birthdayDay": 1,
          "birthdayYear": 1970,
          "groupIds": [20484],
          "sendEmail": true,
          "$image[modifiedDate] = /image/get-image": {
            "@imageId": "$user.portraitId"
          },
          "$roles[name,descriptionCurrentValue] = /role/get-user-roles": {
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
      // var endpoint = self.api + "/user/add-user/company-id/20155/auto-password/true/-password1/-password2/auto-screen-name/true/-screen-name/email-address/" + data.email + "/facebook-id/" + data.id + "/-open-id/-locale/first-name/" + data.first_name + "/-middle-name/prefix-id/0/suffix-id/0/male/true/birthday-month/1/birthday-day/1/birthday-year/1970/-job-title/group-ids/" + [20484] + "/-organization-ids/-role-ids/-user-group-ids/send-email/true";
      // if (data.last_name) {
      //   endpoint += "/lastName/" + data.last_name;
      // }
      const endpoint = self.api + "/invoke?cmd=" + JSON.stringify(map);
      console.log(endpoint);
      self.http.post(endpoint, null, {headers: self.headers})
      .map(res => res.json())
      .subscribe(user => {
        console.log("facebook register returned data");
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

  register(firstName, lastName, email, password, password2) {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = self.api + "/user/add-user/company-id/20155/auto-password/false/password1/" + password + "/password2/" + password2 + "/auto-screen-name/false/screen-name/" + email.split("@")[0] + "/email-address/" + encodeURIComponent(email) + "/facebook-id/0/-open-id/-locale/first-name/" + firstName + "/-middle-name/last-name/" + lastName + "/prefix-id/0/suffix-id/0/male/true/birthday-month/1/birthday-day/1/birthday-year/1970/-job-title/group-ids/" + [20484] + "/-organization-ids/-role-ids/-user-group-ids/send-email/true";
      this.http.post(endpoint, null, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("register returned data");
        console.log(data);
        if (!data.exception) {
          self.login(email, password, (user) => {
            resolve(user);
          });
        } else {
          resolve(data);
        }
      });
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
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
    const endpoint = this.api + "/user/update-portrait.2/userId/" + user.userId;
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
      const endpoint = this.api + "/tmh-project-portlet.usercreditcard/fetch-by-user-id/userId/" + user.userId;
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
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