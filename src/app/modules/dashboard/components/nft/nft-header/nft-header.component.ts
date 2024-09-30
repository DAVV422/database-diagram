import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-nft-header',
    templateUrl: './nft-header.component.html',
    standalone: true,
    imports: [RouterLink]
})
export class NftHeaderComponent implements OnInit {
  constructor(
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  newDiagram(){
    this.router.navigate(['/diagramador/board']);
  }
}
