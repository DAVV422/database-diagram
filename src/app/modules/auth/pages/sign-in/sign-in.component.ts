import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  constructor(
    private readonly _formBuilder: FormBuilder, 
    private readonly _router: Router,
    private authService: AuthService
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.authService.login(email, password).
      subscribe(
        (resp: any) => {
          console.log(resp);
          localStorage.setItem('token', resp.data.accessToken);
          localStorage.setItem('user', JSON.stringify(resp.data.user));
          this._router.navigate(['dashboard']);          
        },
        err => {
          let errorMessage = 'Ocurrió un error durante el inicio de sesión';

          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }

          console.log(errorMessage)
        }
      );    
  }
}
