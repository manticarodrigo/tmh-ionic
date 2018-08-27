import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ChatComponent } from './chat/chat';

@NgModule({
	declarations: [
		ChatComponent
	],
	imports: [IonicModule],
	exports: [
		ChatComponent
	]
})
export class ComponentsModule {}
