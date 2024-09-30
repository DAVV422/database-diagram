import { Component, OnInit } from '@angular/core';
import { NftAuctionsTableItemComponent } from '../nft-auctions-table-item/nft-auctions-table-item.component';
import { NgFor } from '@angular/common';
import { IDiagrama } from '../../../interfaces/diagrama.interface';

@Component({
    selector: '[nft-auctions-table]',
    templateUrl: './nft-auctions-table.component.html',
    standalone: true,
    imports: [NgFor, NftAuctionsTableItemComponent],
})
export class NftAuctionsTableComponent implements OnInit {
  public activeAuction: IDiagrama[] = [];

  constructor() { }

  ngOnInit(): void {}
}
