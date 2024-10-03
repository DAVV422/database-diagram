import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-header-invitaciones',
    templateUrl: './header-invitaciones.component.html',
    standalone: true,
    imports: [RouterLink]
})
export class HeaderInvitacionesComponent implements OnInit {
  constructor(    
  ) {}

  ngOnInit(): void {}
}
