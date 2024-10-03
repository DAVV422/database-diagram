import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { IDiagrama, IDiagramaDB, IInvitacion } from '../../../interfaces/diagrama.interface';
import { InvitacionesTableItemComponent } from '../invitaciones-table-item/invitaciones-table-item.component';

@Component({
    selector: '[invitaciones-table]',
    templateUrl: './invitaciones-table.component.html',
    standalone: true,
    imports: [NgFor, InvitacionesTableItemComponent],
})
export class InvitacionesTableComponent implements OnInit {

  @Input()
  public invitaciones: IInvitacion[] | any = [];

  constructor() { }

  ngOnInit(): void {}
}
