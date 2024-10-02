import { Component, Input, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IDiagrama, IDiagramaDB } from '../../../interfaces/diagrama.interface';
import { Router } from '@angular/router';

@Component({
    selector: '[nft-auctions-table-item]',
    templateUrl: './nft-auctions-table-item.component.html',
    standalone: true,
    imports: [AngularSvgIconModule, CurrencyPipe],
})
export class NftAuctionsTableItemComponent implements OnInit {
  @Input() auction = <IDiagramaDB>{};

  public fecha!: string;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fecha = new Date(this.auction.fecha).toLocaleString();    
  }

  irDiagrama(): void {
    const idDiagrama = this.auction.id
    this.router.navigate(['diagramador/board', idDiagrama]);
  }
}
