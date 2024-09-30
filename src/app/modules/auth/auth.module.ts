import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, AuthRoutingModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
