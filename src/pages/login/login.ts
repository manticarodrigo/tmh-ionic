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
  username = '';
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
        appId: '245954362655647',
        version: 'v2.8'
    });
  }

  toggleType() {
    console.log("Toggling auth type");
    this.signup = !this.signup;
    // this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    // this.password = '';
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
    if (this.username == '' || this.password == '') {
      this.presentError('Please provide a valid username and password.');
      this.loading = false;
    } else {
      this.userService.login(this.username, this.password, (user) => {
        console.log(user);
        if (!user.exception) {
          self.userService.setCurrentUser(user)
          .then(user => {
            this.navCtrl.setRoot('dashboard');
            this.username = '';
            this.password = '';
            this.password2 = '';
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
    if (
      this.username === '' ||
      this.firstName === '' ||
      this.email === '' ||
      this.password === '' ||
      this.password2 === ''
    ) {
      this.presentError('Please provide a first name, email, and matching passwords.');
      this.loading = false;
    } else if (this.password !== this.password2) {
      this.presentError('The provided passwords do not match.')
      this.loading = false;
    } else {
      this.userService.register(this.username, this.password, this.firstName, this.lastName, this.email)
      .then(user => {
        console.log(user);
        if (!user['exception']) {
          self.userService.setCurrentUser(user)
          .then(user => {
            this.username = '';
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';
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
    self.fb.login({ scope:'email,public_profile' })
      .then(response => {
        console.log("facebook login returned response:");
        console.log(response);
        const token = response.authResponse.accessToken;
        if (token) {
          self.userService.facebookAuth(token)
            .then(user => {
              self.userService.setCurrentUser(user);
              self.firstName = '';
              self.lastName = '';
              self.email = '';
              self.password = '';
              self.password2 = '';
              self.loading = false;
              self.navCtrl.setRoot('dashboard');
            })
            .catch(err => {
              console.log(err);
              self.loading = false;
              self.presentError(JSON.parse(err._body).non_field_errors[0]);
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
              // self.userService.fetchUserByEmail(input.email)
              // .then(data => {
              //   if (!data['exception']) {
              //     resolve(data);
              //   } else {
              //     resolve(input);
              //   }
              // });
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

  presentError(message) {
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}