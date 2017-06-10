import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FacebookService, LoginOptions } from 'ngx-facebook';

import { UserService } from '../../providers/user-service';
import { ImageService } from '../../providers/image-service';

@IonicPage({
  name: 'login',
  priority: 'high'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading = false;
  signup = false;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  password2 = '';
  
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private fb: FacebookService,
              private userService: UserService,
              private imageService: ImageService) {
    this.userService.fetchCurrentUser()
    .then(user => {
      if (user) {
        this.navCtrl.setRoot('dashboard');
      }
    });
    // Web Facebook sdk
    this.fb.init({
        appId: '1566594110311271',
        version: 'v2.8'
    });
  }

  toggleType() {
    console.log("Toggling auth type");
    this.signup = !this.signup;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.password2 = '';
  }

  auth() {
    if (this.signup) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    const self = this;
    this.loading = true;
    console.log("login pressed");
    if (this.email == '' || this.password == '') {
      this.presentError('Please provide a valid email and password.');
      this.loading = false;
    } else {
      this.userService.login(this.email, this.password, (user) => {
        console.log(user);
        if (!user.exception) {
          self.userService.setCurrentUser(user)
          .then(user => {
            this.navCtrl.setRoot('dashboard');
            this.email = '';
            this.password = '';
            this.loading = false;
          });
        } else {
          this.presentError('No user found with the provided credentials.');
          this.loading = false;
        }
      });
    }
  }

  register() {
    const self = this;
    this.loading = true;
    console.log("signup pressed");
    if (this.firstName == '' || this.email == '' || this.password == '' || this.password2 == '') {
      this.presentError('Please provide a first name, email, and matching passwords.');
      this.loading = false;
    } else if (this.password != this.password2) {
      this.presentError('The provided password do not match.')
      this.loading = false;
    } else {
      this.userService.register(this.firstName, this.lastName, this.email, this.password, this.password2)
      .then(user => {
        console.log(user);
        if (!user['exception']) {
          self.userService.setCurrentUser(user)
          .then(user => {
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';
            this.password2 = '';
            this.loading = false;
            this.navCtrl.setRoot('dashboard');
          });
        } else {
          this.presentError('Registration failed. Please try again.');
          this.loading = false;
        }
      });
    }
  }

  facebookLogin() {
    let self = this;
    this.loading = true;
    console.log("starting facebook login...");
    self.fb.login({scope:'email,public_profile'})
    .then(response => {
      console.log("facebook login returned response:");
      console.log(response);
      if (response.authResponse.accessToken) {
        console.log("calling core facebook api");
        self.fb.api('/me?fields=id,email,name,first_name,last_name')
        .then(apiData => {
          console.log('facebook api returned:');
          console.log(apiData);
          self.processFacebookResponse(response, apiData);
        }).catch(error => {
          console.log(error);
          self.presentError('Facebook auth failed. Please try again.');
          self.loading = false;
        });
      } else {
        self.presentError('Facebook auth failed. Please try again.');
        self.loading = false;
      }
    })
    .catch(error => {
      console.log(error);
      self.presentError('Facebook auth failed. Please try again.');
      self.loading = false;
    });
  }

  processFacebookResponse(response, apiData) {
    const self = this;
    console.log("processing facebook reponse");
    self.userService.fetchUserByFacebookId(response.authResponse.userID)
    .then(user => {
      if (!user['exception']) {
        self.userService.setCurrentUser(user)
        .then(user => {
          self.firstName = '';
          self.lastName = '';
          self.email = '';
          self.password = '';
          self.password2 = '';
          self.loading = false;
          self.navCtrl.setRoot('dashboard');
        });
      } else {
        if (!apiData.email) {
          self.handleNoEmail()
          .then(data => {
            if (data['email']) {
              apiData.email = data['email'];
              self.processFacebookAuth(response, apiData);
            } else {
              self.presentError('Facebook auth failed. Please try again.');
              self.loading = false;
            }
          });
        } else {
          self.processFacebookAuth(response, apiData);
        }
      }
    });
  }

  handleNoEmail() {
    const self = this;
    console.log("handling no email");
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Please provide a valid email:',
        inputs: [
        {
          name: 'email',
          placeholder: 'Email Address'
        }
        ],
        buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            resolve(null);
          }
        },
        {
          text: 'SUBMIT',
          handler: input => {
            if (input.email) {
              self.userService.fetchUserByEmail(input.email)
              .then(data => {
                if (!data['exception']) {
                  resolve(data);
                } else {
                  resolve(input);
                }
              });
            } else {
              resolve(null);
            }
          }
        }
        ]
      });
      alert.present();
    });
  }

  processFacebookAuth(response, apiData) {
    const self = this;
    console.log("processing facebook registration");
    self.userService.fetchUserByEmail(apiData.email)
    .then(user => {
      if (!user['exception']) {
        if (user['facebookId'] == 0) {
          user['facebookId'] = response.authResponse.userID;
          self.userService.updateUserFacebookId(user, response.authResponse.userID)
          .then(user => {
            if (!user['exception']) {
              self.userService.setCurrentUser(user)
              .then(user => {
                self.firstName = '';
                self.lastName = '';
                self.email = '';
                self.password = '';
                self.password2 = '';
                self.loading = false;
                self.navCtrl.setRoot('dashboard');
              });
            } else {
              self.presentError('Facebook auth failed. Please try again.');
              self.loading = false;
            }
          });
        } else {
          self.presentError('Email is taken. Please try again.');
          self.loading = false;
        }
      } else {
        self.userService.facebookRegister(apiData)
        .then(user => {
          if (!user['exception']) {
            self.userService.setCurrentUser(user)
            .then(user => {
              self.firstName = '';
              self.lastName = '';
              self.email = '';
              self.password = '';
              self.password2 = '';
              self.loading = false;
              self.userService.headers = self.userService.headers;
              self.navCtrl.setRoot('dashboard');
            });
          }
        });
      }
    })
  }

  presentError(message) {
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}