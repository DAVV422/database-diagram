import { Component, OnInit } from '@angular/core';
import { NftAuctionsTableComponent } from './../../components/nft/nft-auctions-table/nft-auctions-table.component';
import { NftHeaderComponent } from './../../components/nft/nft-header/nft-header.component';
import { IDiagrama, IDiagramaDB } from '../../interfaces/diagrama.interface';
import { DiagramaService } from '../../services/diagrama.service';

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
  public diagramas?: Array<IDiagramaDB> | null = null;

  constructor(
    private diagramaService: DiagramaService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user")!);
    const idUser = user.id;
    this.diagramaService.getDiagramasCreados(idUser).subscribe(
      (resp: any) => {
        this.diagramas = resp.data;
      }
    );
  }
}
