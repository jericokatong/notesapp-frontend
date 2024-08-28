import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GlobalState } from '../global.reducer';
import { Store } from '@ngrx/store';
import { logout } from '../global.actions';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private http: HttpClient,
    private store: Store<{ global: GlobalState }>,
    private router: Router
  ) {}

  logout() {
    const refreshToken: string = localStorage.getItem('refreshToken')!;
    this.http
      .delete(`${environment.apiUrl}/authentications`, {
        body: {
          refreshToken,
        },
      })
      .subscribe({
        complete: () => {
          localStorage.clear();
          this.store.dispatch(logout());
          this.router.navigate(['login']);
        },
        error: (response: any) => {
          console.log('ini error: ', response);
        },
      });
  }
}
