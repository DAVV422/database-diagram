import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DiagramaService } from '../../../../diagrama/services/diagrama.service';

@Component({
    selector: 'app-nft-header',
    templateUrl: './nft-header.component.html',
    standalone: true,
    imports: [RouterLink]
})
export class NftHeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private readonly diagramaService: DiagramaService
  ) {}

  ngOnInit(): void {}

  newDiagram(){
    console.log("crea diagrama");
    this.diagramaService.saveDiagram("unsaved", "[]", "[]").subscribe(      
      (resp: any) => {
        const idDiagrama = resp.data.id;
        this.router.navigate(['/diagramador/board', idDiagrama]);
      }
    );    
  }
}
