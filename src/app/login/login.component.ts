import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GlobalState } from '../global.reducer';
import { login } from '../global.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  applyForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  error: string = '';

  constructor(
    private http: HttpClient,
    private store: Store<{ global: GlobalState }>,
    private router: Router
  ) {}

  login() {
    this.http
      .post('http://localhost:3000/authentications', this.applyForm.value)
      .subscribe({
        next: (response: any) => {
          // save user identify to global state
          this.store.dispatch(
            login({
              userId: response.data.userId,
              fullname: response.data.fullname,
              username: response.data.username,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            })
          );

          // save refreshToken to localStorage
          localStorage.setItem('refreshToken', response.data.refreshToken);

          // save id user to localStorage
          localStorage.setItem('userId', response.data.userId);

          // reset form input
          this.applyForm.reset();

          // navigate user to home page
          this.router.navigate(['']);
        },
        error: (response: any) => {
          console.log('ini error: ', response);
          this.error = response.error.message;
        },
      });
  }
}
