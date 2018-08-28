import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ChatComponent } from './chat/chat';
import { NavbarComponent } from './navbar/navbar';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
	declarations: [
		ChatComponent,
    NavbarComponent
	],
	imports: [IonicModule, PipesModule],
	exports: [
		ChatComponent,
    NavbarComponent
	]
})
export class ComponentsModule {}
