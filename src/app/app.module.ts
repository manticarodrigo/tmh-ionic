import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TheManHome } from './app.component';

import { UserService } from '../providers/user-service';
import { ImageService } from '../providers/image-service';
import { ProjectService } from '../providers/project-service';
import { SocketService } from '../providers/socket-service';
import { ChatService } from '../providers/chat-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { FacebookService } from 'ngx-facebook';

@NgModule({
  declarations: [
    TheManHome
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(TheManHome, {
      mode: 'md',
      activator: 'none',
      preloadModules: true
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TheManHome
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    ImageService,
    ProjectService,
    SocketService,
    ChatService,
    FacebookService
  ]
})
export class AppModule {}
