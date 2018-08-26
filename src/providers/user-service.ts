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
    const authHeader = `Token ${this.currentUser.key}`;
    headers.append('Authorization', authHeader);
    return headers;
  }

  fetchCurrentUser() {
    return new Observable(observer => {
      if (this.currentUser) {
        observer.next(this.currentUser);
        observer.complete()
      } else {
        this.storage.get('user')
          .then(user => {
            observer.next(user ? this.setCurrentUser(user) : null);
            observer.complete()
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
      `${ENV.backendUrl}/rest-auth/login/`,
      {
        username,
        password
      }
    )
      .map(res => res.json())
      .subscribe(
        res => {
          console.log(res);
          if (res.user && res.key) {
            const user = res.user
            user.key = res.key
            this.setCurrentUser(user)
            callback(user);
          } else {
            callback(null);
          }
        },
        err => {
          console.log(err);
          callback(null);
        }
    );
  }

  register(username, first_name, last_name, email, password1, password2) {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${ENV.backendUrl}/rest-auth/registration/`,
        {
          username,
          first_name,
          last_name,
          email,
          password1,
          password2
        }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log(res);
            if (res.user && res.key) {
              const user = res.user
              user.key = res.key
              this.setCurrentUser(user)
              resolve(user);
            } else {
              reject(null);
            }
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
            if (res.user && res.key) {
              const user = res.user
              user.key = res.key
              this.setCurrentUser(user)
              resolve(user);
            } else {
              reject(null);
            }
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  fetchUser(uid) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/users/${uid}/`,
        { headers: this.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(user => {
          console.log('fetched user:', user);
          resolve(user);
        });
    });
  }

  updateUser(user, file) {
    return new Promise((resolve, reject) => {
      console.log('updating user:', user, file);
      const formData = new FormData();
      if (file && typeof file.name === 'string') {
        formData.append('image', file);
      }
      formData.append('first_name', user.first_name);
      formData.append('last_name', user.last_name);
      formData.append('city', user.city);
      formData.append('state', user.state);
      this.http.patch(
        `${ENV.backendUrl}/api/v1/users/${user.id}/`,
        formData,
        { headers: this.getHeaders() })
      .map(res => res.json())
      .subscribe(
        res => {
          console.log('update user returned response:', res);
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  fetchCreditCard(user) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log('fetching credit card for user:', user);
      const endpoint = ENV.backendUrl + '/tmh-project-portlet.usercreditcard/fetch-by-user-id/userId/' + user.userId;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log('found user credit card:', data);
        resolve(data);
      });
    });
  }
  
}