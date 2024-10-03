import { Component, OnInit } from '@angular/core';
import { IDiagrama, IDiagramaDB } from '../../interfaces/diagrama.interface';
import { DiagramaService } from '../../services/diagrama.service';
import { HeaderInvitadosComponent } from '../../components/nft-invitados/header-invitados/header-invitados.component';
import { InvitadosTableComponent } from '../../components/nft-invitados/invitados-table/invitados-table.component';

@Component({
    selector: 'app-list-invitados',
    templateUrl: './list-invitados.component.html',
    standalone: true,
    imports: [
        HeaderInvitadosComponent,
        InvitadosTableComponent,
    ],
})
export class ListInvitadosComponent implements OnInit {
  public diagramas?: Array<IDiagramaDB> | null = null;

  constructor(
    private diagramaService: DiagramaService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user")!);
    const idUser = user.id;
    this.diagramaService.getDiagramasInvitados(idUser)
    .subscribe(
      (resp: any) => {
        this.diagramas = resp.data;
      }
    );
  }
}
