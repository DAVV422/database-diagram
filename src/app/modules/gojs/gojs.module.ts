import { NgModule } from '@angular/core';
import { DataSyncService } from './service/data-sync.service';
import { DiagramComponent } from './diagram/diagram.component';
import { OverviewComponent } from './overview/overview.component';
import { PaletteComponent } from './palette/palette.component';

@NgModule({
  declarations: [
    DiagramComponent,
    OverviewComponent,
    PaletteComponent
  ],
  imports: [
  ],
  providers: [
    DataSyncService
  ],
  exports: [
    DiagramComponent,
    OverviewComponent,
    PaletteComponent
  ]
})
export class GojsModule { }