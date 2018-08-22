import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from './details';
import { ChatPage } from './chat/chat';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DetailsPage,
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(DetailsPage),
    PipesModule
  ],
  exports: [
    DetailsPage,
    ChatPage
  ]
})
export class DetailsPageModule {}