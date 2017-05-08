import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
// import { Facebook } from 'ionic-native';
import { FacebookService } from 'ng2-facebook-sdk';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  signup = false;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  password2 = '';
  private FB_APP_ID: number = 713879188793156;
  private permissions: Array<string> = [
                'public_profile',
            ];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private platform: Platform,
              private fb: FacebookService,
              private userService: UserService) {
    this.platform.ready().then(() => {
      // Check If Cordova/Mobile
      if (this.platform.is('cordova')) {
        // Native Facebook sdk
        // Facebook.browserInit(this.FB_APP_ID, "v2.8");
      } else {
        // Web Facebook sdk
        this.fb.init({
            appId: '713879188793156',
            version: 'v2.8'
        });
      }
    });
  }

  toggleType() {
    console.log("Toggling auth type");
    this.signup = !this.signup;
  }

  auth() {
    if (this.signup) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    console.log("login pressed");
    if (this.email == '' || this.password == '') {
      this.presentError('Please provide a valid email and password.');
    } else {
      this.userService.login(this.email, this.password, (data) => {
        console.log(data);
        if (!data.exception) {
          this.email = '';
          this.password = '';
          this.navCtrl.setRoot('Dashboard');
        } else {
          this.presentError('No user found with the provided credentials.');
        }
      });
    }
  }

  register() {
    console.log("signup pressed");
    if (this.firstName == '' || this.email == '' || this.password == '' || this.password2 == '') {
      this.presentError('Please provide a first name, email, and matching passwords.');
    } else {
      // this.userService.login(this.email, this.password, (data) => {
      //   console.log(data);
      //   if (!data.exception) {
      //     this.email = '';
      //     this.password = '';
      //     this.navCtrl.setRoot('Dashboard');
      //   } else {
      //     this.presentError();
      //   }
      // });
    }
  }

  facebookLogin(): Promise<any> {
    let env = this;
    return new Promise((resolve, reject) => {
        // Check If Cordova/Mobile
        if (this.platform.is('cordova')) {
            console.log("Starting Mobile Facebook login...");
            // Facebook.login(env.permissions)
            // .then(response => {
            //     console.log("Mobile Facebook login returned response.");
            //     resolve(response);
            // })
            // .catch(error => {
            //     console.log(error);
            //     reject(error);
            // });
        } else {
            console.log("Starting Core Facebook login...");
            env.fb.login(env.permissions)
            .then(response => {
                console.log("Core Facebook login returned response.");
                resolve(response);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        }
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