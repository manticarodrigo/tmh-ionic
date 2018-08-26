import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlternativesPage } from './alternatives';

@NgModule({
  declarations: [
    AlternativesPage,
  ],
  imports: [
    IonicPageModule.forChild(AlternativesPage),
  ],
  exports: [
    AlternativesPage
  ]
})
export class AlternativesPageModule {}
