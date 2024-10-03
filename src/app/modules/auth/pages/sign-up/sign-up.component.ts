import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from './../../../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  constructor(
    private readonly _formBuilder: FormBuilder, 
    private readonly _router: Router,
    private authService: AuthService
  ) {}

  // onClick() {
  //   console.log('Button clicked');
  // }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
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
    const { nombre, apellido, email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.authService.register({ nombre, apellido, email, password, role:"basic" }).
      subscribe(
        (resp: any) => {
          this.authService.login(email, password)
            .subscribe(
              (resp: any) => {
                localStorage.setItem('token', resp.data.accessToken);
                localStorage.setItem('user', JSON.stringify(resp.data.user));
                this._router.navigate(['dashboard']);          
              },
            );
        },
        err => {
          let errorMessage = 'Ocurrió un error durante la creación de la cuenta';

          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }

          console.log(errorMessage)
        }
      );    
  }
}
