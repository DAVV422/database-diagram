import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagramaComponent } from './diagrama/diagrama.component';

const routes: Routes = [
  {
    path: 'boards',
    children: [
      {
        path: 'new-board',
        component: DiagramaComponent
      },
      {
        path: '',
        redirectTo: 'new-board',
        pathMatch: 'full'        
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagramaRoutingModule { }