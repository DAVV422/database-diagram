import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GojsModule } from '../gojs/gojs.module';
import { DiagramaComponent } from './diagrama/diagrama.component';

import { InspectorComponent } from './inspector/inspector.component'; 
import { InspectorRowComponent } from './inspector-row/inspector-row.component';
import { DiagramaRoutingModule } from './diagrama-routing.module';
import { PaletteComponent } from './palette/palette.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    DiagramaComponent,
    InspectorComponent,
    InspectorRowComponent,
    PaletteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DiagramaRoutingModule,
    GojsModule,
  ],
  exports: [
    PaletteComponent,
    DiagramaComponent
  ],
})
export class DiagramaModule { }