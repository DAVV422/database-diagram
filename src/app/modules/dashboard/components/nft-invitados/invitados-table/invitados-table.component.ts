import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { IDiagrama, IDiagramaDB } from '../../../interfaces/diagrama.interface';
import { InvitadosTableItemComponent } from '../invitados-table-item/invitados-table-item.component';

@Component({
    selector: '[invitados-table]',
    templateUrl: './invitados-table.component.html',
    standalone: true,
    imports: [NgFor, InvitadosTableItemComponent],
})
export class InvitadosTableComponent implements OnInit {

  @Input()
  public diagramas: IDiagramaDB[] | any = [];

  constructor() { }

  ngOnInit(): void {}
}
