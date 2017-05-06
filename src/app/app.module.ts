import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TheManHome } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { UserService } from '../providers/user-service';
import { ImageService } from '../providers/image-service';
import { ProjectService } from '../providers/project-service';
import { ChatService } from '../providers/chat-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    TheManHome,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(TheManHome, {
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TheManHome,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    ImageService,
    ProjectService,
    ChatService
  ]
})
export class AppModule {}
