import { Component, OnInit } from '@angular/core';
import { IDiagrama, IDiagramaDB, IInvitacion } from '../../interfaces/diagrama.interface';
import { DiagramaService } from '../../services/diagrama.service';
import { HeaderInvitacionesComponent } from '../../components/nft-invitaciones/header-invitaciones/header-invitaciones.component';
import { InvitacionesTableComponent } from '../../components/nft-invitaciones/invitaciones-table/invitaciones-table.component';

@Component({
    selector: 'app-invitaciones',
    templateUrl: './invitaciones.component.html',
    standalone: true,
    imports: [
        HeaderInvitacionesComponent,
        InvitacionesTableComponent,
    ],
})
export class InvitacionesComponent implements OnInit {
  public invitaciones?: Array<IInvitacion> | null = null;

  constructor(
    private diagramaService: DiagramaService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user")!);
    const idUser = user.id;
    this.diagramaService.getInvitaciones(idUser).subscribe(
      (resp: any) => {
        this.invitaciones = resp.data;
      }
    );
  }
}
