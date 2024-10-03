import { Component, Input, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IInvitacion } from '../../../interfaces/diagrama.interface';
import { Router } from '@angular/router';
import { DiagramaService } from '../../../../diagrama/services/diagrama.service';

@Component({
    selector: '[invitaciones-table-item]',
    templateUrl: './invitaciones-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule, CurrencyPipe],
})
export class InvitacionesTableItemComponent implements OnInit {
  @Input() auction = <IInvitacion>{};

  public fecha!: string;

  public useremail!: string; 

  constructor(
    private router: Router,
    private diagramaService: DiagramaService
  ) {}

  ngOnInit(): void {
    this.fecha = new Date(this.auction.fecha).toLocaleString(); 
    console.log(this.auction);
    this.useremail = this.auction.diagrama!.usuario!.email; 
  }

  irDiagrama(): void {
    const idDiagrama = this.auction.diagrama?.id;
    this.diagramaService.updateInvitacion(this.auction.id!)
    .subscribe(
      (resp: any) => {
        this.router.navigate(['diagramador/board', idDiagrama]);
      }
    )    
  }
}
