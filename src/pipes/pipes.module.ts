import { NgModule } from '@angular/core';
import { DaysLeftPipe } from './days-left/days-left';
import { PriceTotalPipe } from './price-total/price-total';
@NgModule({
	declarations: [DaysLeftPipe,
    PriceTotalPipe],
	imports: [],
	exports: [
		DaysLeftPipe,
		PriceTotalPipe
	]
})
export class PipesModule {}
