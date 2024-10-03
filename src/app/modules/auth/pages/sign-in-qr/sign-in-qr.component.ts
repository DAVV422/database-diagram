import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';
import { DiagramaService } from '../../../diagrama/services/diagrama.service';

@Component({
  selector: 'app-sign-in-qr',
  templateUrl: './sign-in-qr.component.html',
  styleUrls: ['./sign-in-qr.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class SignInQrComponent implements OnInit {
  form!: FormGroup;
  idDiagrama!: string;
  submitted = false;
  passwordTextType!: boolean;

  constructor(
    private readonly _formBuilder: FormBuilder, 
    private readonly _router: Router,
    private readonly route: ActivatedRoute,
    private authService: AuthService,
    private diagramaService: DiagramaService
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.idDiagrama = this.route.snapshot.params['id'];    
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });    
    let user: any = localStorage.getItem('user');
    if (user && user != "undefined") {
      user = JSON.parse(user);
      console.log(user);
      this.diagramaService.createInvitacion(user.id, this.idDiagrama)
      .subscribe(
        (resp) => {
          confirm("Invitacion Guardada");
          this._router.navigate(['dashboard/invitaciones']);
        }
      );    
    }
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
          this.diagramaService.createInvitacion(resp.data.user.id, this.idDiagrama)
            .subscribe(
              (resp) => {
                confirm("Invitacion Guardada");
              }
            );
          localStorage.setItem('token', resp.data.accessToken);
          localStorage.setItem('user', JSON.stringify(resp.data.user));
          this._router.navigate(['dashboard/invitaciones', resp.data.user.id]);
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
