import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { GlobalState } from '../global.reducer';
import { selectAccessToken } from '../global.selector';
import { concatMap, tap } from 'rxjs';

interface Note {
  id: string;
  title: string;
  body: string;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
})
export class NoteComponent {
  @Input() note!: Note;
  @Output() noteDeleted = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{ global: GlobalState }>
  ) {}

  deleteNote(noteId: string): void {
    this.store
      .select(selectAccessToken)
      .pipe(
        tap((accessToken: string | null) =>
          console.log('ini accessToken di hapus note: ', accessToken)
        ),
        concatMap((accessToken: string | null) => {
          const headers: HttpHeaders = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
          });

          return this.http.delete(`${environment.apiUrl}/notes/${noteId}`, {
            headers,
          });
        }),
        tap({
          next: (response: any) => {
            console.log('ini response hasil delete note: ', response);
            this.noteDeleted.emit();
          },
          error: (response: any) => {
            console.log('ini response error delete note: ', response);
          },
        })
      )
      .subscribe();
  }
}
