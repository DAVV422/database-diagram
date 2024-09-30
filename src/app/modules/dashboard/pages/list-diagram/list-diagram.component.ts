import { Component, OnInit } from '@angular/core';
import { NftAuctionsTableComponent } from './../../components/nft/nft-auctions-table/nft-auctions-table.component';
import { NftHeaderComponent } from './../../components/nft/nft-header/nft-header.component';
import { IDiagrama } from '../../interfaces/diagrama.interface';

@Component({
    selector: 'app-nft',
    templateUrl: './list-diagram.component.html',
    standalone: true,
    imports: [
        NftHeaderComponent,
        NftAuctionsTableComponent,
    ],
})
export class ListDiagramComponent implements OnInit {
  private diagramas?: Array<IDiagrama>;

  constructor() { }

  ngOnInit(): void {}
}
