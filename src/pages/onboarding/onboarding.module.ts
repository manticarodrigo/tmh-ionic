import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Onboarding } from './onboarding';

@NgModule({
  declarations: [
    Onboarding,
  ],
  imports: [
    IonicPageModule.forChild(Onboarding),
  ],
  exports: [
    Onboarding
  ]
})
export class OnboardingModule {}