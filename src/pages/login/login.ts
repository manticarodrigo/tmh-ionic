import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FacebookService } from 'ngx-facebook';

import { UserService } from '../../providers/user-service';

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
  
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private fb: FacebookService,
    private userService: UserService
  ) {
    // Web Facebook sdk
    this.fb.init({
        appId: '245954362655647',
        version: 'v2.8'
    });
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.navCtrl.setRoot('dashboard');
        }
      });
  }

  toggleType() {
    this.signup = !this.signup;
  }

  auth() {
    switch(this.signup) {
      case true:
        this.register()
        break;
      case false:
        this.login();
        break;
      default:
        this.login();
    }
  }

  login() {
    this.loading = true;
    if (this.username == '' || this.password == '') {
      this.presentError('Please provide a valid username and password.');
      this.loading = false;
    } else {
      this.userService.login(this.username, this.password)
        .then(() => {
          this.navCtrl.setRoot('dashboard');
          this.username = '';
          this.password = '';
          this.password2 = '';
          this.loading = false;
        })
        .catch(error => {
          this.presentError(error);
          this.loading = false;
        });
    }
  }

  register() {
    this.loading = true;
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
      this.userService.register(
        this.username,
        this.firstName,
        this.lastName,
        this.email,
        this.password,
        this.password2
      )
        .then(
          res => {
            console.log(res);
            this.username = '';
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';
            this.password2 = '';
            this.loading = false;
            this.navCtrl.setRoot('dashboard');
          },
          err => {
            console.log(err);
            this.presentError('Registration failed. Please try again.');
            this.loading = false;
          },
        );
    }
  }

  facebookLogin() {
    this.loading = true;
    this.fb.login({ scope:'email,public_profile' })
      .then(response => {
        console.log(response);
        const token = response.authResponse.accessToken;
        if (token) {
          this.userService.facebookAuth(token)
            .then(
              res => {
                console.log(res);
                this.firstName = '';
                this.lastName = '';
                this.email = '';
                this.password = '';
                this.password2 = '';
                this.loading = false;
                this.navCtrl.setRoot('dashboard');
              },
              err => {
                console.log(err);
                this.loading = false;
                this.presentError(JSON.parse(err._body).non_field_errors[0]);
              }
            );
        } else {
          this.presentError('Facebook auth failed. Please try again.');
          this.loading = false;
        }
      })
      .catch(err => {
        console.log(err);
        this.presentError('Facebook auth failed. Please try again.');
        this.loading = false;
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