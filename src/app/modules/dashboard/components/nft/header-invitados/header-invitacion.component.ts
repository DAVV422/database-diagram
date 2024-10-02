import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-header-invitacion',
    templateUrl: './header-invitados.component.html',
    standalone: true,
    imports: [RouterLink]
})
export class HeaderInvitacionComponent implements OnInit {
  constructor(
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  newDiagram(){
    this.router.navigate(['/diagramador/board']);
  }
}
