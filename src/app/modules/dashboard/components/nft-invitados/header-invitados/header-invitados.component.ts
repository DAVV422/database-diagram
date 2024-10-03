import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-header-invitacion',
    templateUrl: './header-invitados.component.html',
    standalone: true,
    imports: [RouterLink]
})
export class HeaderInvitadosComponent implements OnInit {
  constructor(    
  ) {}

  ngOnInit(): void {}
}
