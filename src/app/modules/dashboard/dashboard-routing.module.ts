import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ListDiagramComponent } from './pages/list-diagram/list-diagram.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ListInvitadosComponent } from './pages/list-invitados/list-invitados.component';
import { InvitacionesComponent } from './pages/invitaciones/invitaciones.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'diagramas', pathMatch: 'full' },
      { path: 'diagramas', component: ListDiagramComponent },
      { path: 'invitaciones', component: InvitacionesComponent },
      { path: 'compartidos', component: ListInvitadosComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
