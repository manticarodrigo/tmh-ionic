import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from './details';
import { ChatPageModule } from '../../components/chat/chat.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DetailsPage
  ],
  imports: [
    IonicPageModule.forChild(DetailsPage),
    PipesModule,
    ChatPageModule
  ],
  exports: [
    DetailsPage
  ]
})
export class DetailsPageModule {}