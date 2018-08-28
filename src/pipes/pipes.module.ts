import { NgModule } from '@angular/core';
import { DaysLeftPipe } from './days-left/days-left';
import { PriceTotalPipe } from './price-total/price-total';
import { ReadableRoomPipe } from './readable-room/readable-room';
@NgModule({
	declarations: [DaysLeftPipe,
    PriceTotalPipe,
    ReadableRoomPipe],
	imports: [],
	exports: [
		DaysLeftPipe,
		PriceTotalPipe,
    ReadableRoomPipe
	]
})
export class PipesModule {}
