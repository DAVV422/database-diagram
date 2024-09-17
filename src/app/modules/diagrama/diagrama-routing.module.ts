import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagramaComponent } from './diagrama/diagrama.component';

const routes: Routes = [
  {
    path: '',
    component: DiagramaComponent,
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagramaRoutingModule { }
