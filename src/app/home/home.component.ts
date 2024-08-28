import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NoteComponent } from '../note/note.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { GlobalState } from '../global.reducer';
import { selectAccessToken, selectFullname } from '../global.selector';
import { take } from 'rxjs';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink, HeaderComponent, NoteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  noteList: Note[] = [];
  fullname!: string;
  private accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private store: Store<{ global: GlobalState }>
  ) {}

  ngOnInit() {
    this.store
      .select(selectAccessToken)
      .pipe(take(1))
      .subscribe((itemAccessToken) => {
        this.accessToken = itemAccessToken;
      });

    this.store
      .select(selectFullname)
      .pipe(take(1))
      .subscribe((itemFulllname) => (this.fullname = itemFulllname));

    this.getNoteList();
  }

  getNoteList() {
    console.log('ini access token: ', this.accessToken);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    this.http
      .get(`${environment.apiUrl}/notes`, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          this.noteList = response.data.notes;
          console.log('ini response: ', response);
        },
        error: (response: any) => {
          console.log('ini error: ', response);
        },
      });
  }
}
