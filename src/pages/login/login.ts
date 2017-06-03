import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
// import { Facebook } from 'ionic-native';
import { FacebookService } from 'ngx-facebook';

import { UserService } from '../../providers/user-service';
import { ImageService } from '../../providers/image-service';

@IonicPage()
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
  private FB_APP_ID: number = 1566594110311271;
  private permissions: Array<string> = [
                'public_profile',
            ];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private platform: Platform,
              private fb: FacebookService,
              private userService: UserService,
              private imageService: ImageService) {
    this.platform.ready().then(() => {
      // Check If Cordova/Mobile
      if (this.platform.is('cordova')) {
        // Native Facebook sdk
        // Facebook.browserInit(this.FB_APP_ID, "v2.8");
      } else {
        // Web Facebook sdk
        this.fb.init({
            appId: '1566594110311271',
            version: 'v2.8'
        });
      }
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
    this.loading = true;
    if (this.signup) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    const self = this;
    console.log("login pressed");
    if (this.email == '' || this.password == '') {
      this.presentError('Please provide a valid email and password.');
      this.loading = false;
    } else {
      this.userService.login(this.email, this.password, (user) => {
        console.log(user);
        if (!user.exception) {
          const token = btoa(this.email + ':' + this.password);
          self.userService.headers = self.userService.generateHeaders(token);
          Promise.all([self.imageService.imageForUser(user), self.userService.getUserRoles(user)])
          .then(data => {
            const url = data[0];
            const roles = data[1];
            if (url) {
              user.photoURL = url;
            }
            for (var key in roles) {
              const role = roles[key];
              if (role.name == "Administrator") {
                console.log("welcome back " + user.firstName + ".");
                console.log("you're an admin, and always remember what liferay says about at admins:");
                console.log(role.descriptionCurrentValue);
                user.admin = true;
              }
            }
            self.userService.setCurrentUser(user, token)
            .then(user => {
              this.navCtrl.setRoot('DashboardPage');
              this.email = '';
              this.password = '';
              this.loading = false;
            })
          });
        } else {
          this.presentError('No user found with the provided credentials.');
          this.loading = false;
        }
      });
    }
  }

  register() {
    console.log("signup pressed");
    if (this.firstName == '' || this.email == '' || this.password == '' || this.password2 == '') {
      this.presentError('Please provide a first name, email, and matching passwords.');
      this.loading = false;
    } else if (this.password != this.password2) {
      this.presentError('The provided password do not match.')
      this.loading = false;
    } else {
      this.userService.register(this.firstName, this.lastName, this.email, this.password, this.password2, (data) => {
        console.log(data);
        if (!data.exception) {
          this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';
          this.password2 = '';
          this.loading = false;
          this.navCtrl.setRoot('DashboardPage');
        } else {
          this.presentError('Registration failed. Please try again.');
          this.loading = false;
        }
      });
    }
  }

  facebookLogin() {
    let self = this;
    // Check If Cordova/Mobile
    if (this.platform.is('cordova')) {
        console.log("Starting Mobile Facebook login...");
        // Facebook.login(env.permissions)
        // .then(response => {
        //     console.log("Mobile Facebook login returned response.");
        //     this.loading = false;
        //     resolve(response);
        // })
        // .catch(error => {
        //     console.log(error);
        //     reject(error);
        // });
    } else {
        console.log("Starting Core Facebook login...");
        self.fb.login()
        .then(response => {
            console.log("Core Facebook login returned response:");
            console.log(response);
            this.loading = false;
            // this.userService.register(this.firstName, this.lastName, this.email, this.password, this.password2, (data) => {
            //   console.log(data);
            //   if (!data.exception) {
            //     this.firstName = '';
            //     this.lastName = '';
            //     this.email = '';
            //     this.password = '';
            //     this.password2 = '';
            //     this.loading = false;
            //     this.navCtrl.setRoot('DashboardPage');
            //   } else {
            //     this.presentError('Registration failed. Please try again.');
            //     this.loading = false;
            //   }
            // });
        })
        .catch(error => {
            console.log(error);
            this.loading = false;
        });
    }
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