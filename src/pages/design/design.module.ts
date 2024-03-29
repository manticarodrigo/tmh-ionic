import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DesignPage } from './design';

import { CollectionBoxComponent } from './collection-box/collection-box';
import { FloorplanMapComponent } from './floorplan-map/floorplan-map';
import { ProjectItemsComponent } from './project-items/project-items';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DesignPage,
    CollectionBoxComponent,
    FloorplanMapComponent,
    ProjectItemsComponent
  ],
  imports: [
    IonicPageModule.forChild(DesignPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    DesignPage
  ]
})
export class DesignPageModule {}