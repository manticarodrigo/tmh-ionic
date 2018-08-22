import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DesignPage } from './design';
import { ChatPage } from './chat/chat';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DesignPage,
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(DesignPage),
    PipesModule
  ],
  exports: [
    DesignPage,
    ChatPage
  ]
})
export class DesignPageModule {}