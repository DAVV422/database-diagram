import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignInComponent,    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
  ],
  exports: [
    SignInComponent
  ]
})
export class AuthModule { }
