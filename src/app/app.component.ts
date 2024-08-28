import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { GlobalState } from './global.reducer';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'notesapp-frontend';

  constructor(private store: Store<GlobalState>) {
    console.log(environment);
    this.store.subscribe((state) => {
      console.log('Current Store State: ', state);
    });
  }
}
