import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TheManHome } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { UserService } from '../providers/user-service';
import { ImageService } from '../providers/image-service';
import { ProjectService } from '../providers/project-service';
import { SocketService } from '../providers/socket-service';
import { ChatService } from '../providers/chat-service';

import { ChatPage } from '../pages/chat/chat';
import { DetailsPage } from '../pages/details/details';
import { DesignPage } from '../pages/design/design';
import { FinalDeliveryPage } from '../pages/final-delivery/final-delivery';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { Facebook } from '@ionic-native/facebook';
import { FacebookService } from 'ngx-facebook';

@NgModule({
  declarations: [
    TheManHome,
    TabsPage,
    ChatPage,
    DetailsPage,
    DesignPage,
    FinalDeliveryPage
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
    TabsPage,
    ChatPage,
    DetailsPage,
    DesignPage,
    FinalDeliveryPage
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
    Facebook,
    FacebookService
  ]
})
export class AppModule {}
