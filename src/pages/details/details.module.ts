import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from './details';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DetailsPage
  ],
  imports: [
    IonicPageModule.forChild(DetailsPage),
    PipesModule,
    ComponentsModule
  ],
  exports: [
    DetailsPage
  ]
})
export class DetailsPageModule {}