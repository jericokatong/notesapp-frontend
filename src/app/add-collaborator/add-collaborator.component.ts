import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GlobalState } from '../global.reducer';
import { selectAccessToken } from '../global.selector';
import { concatMap, tap } from 'rxjs';

interface User {
  id: string;
  username: string;
  fullname: string;
}

@Component({
  selector: 'app-add-collaborator',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './add-collaborator.component.html',
  styleUrl: './add-collaborator.component.css',
})
export class AddCollaboratorComponent {
  users!: Array<User>;
  userForm: FormGroup;
  noteId!: string;
  currentCollaborators!: Array<{
    note_id: string;
    user_id: string;
    fullname: string;
  }>;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ global: GlobalState }>
  ) {
    this.noteId = route.snapshot.params['id'];

    this.userForm = this.fb.group({
      selectedUser: ['', Validators.required],
    });

    this.store
      .select(selectAccessToken)
      .pipe(
        concatMap((accessToken: string | null) => {
          const headers: HttpHeaders = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
          });
          return this.http.get(`${environment.apiUrl}/notes/${this.noteId}`, {
            headers,
          });
        }),
        tap((response: any) => {
          console.log(
            'ini response current collaborator: ',
            response.data.note.collaborators
          );
          this.currentCollaborators = response.data.note.collaborators;
        }),
        concatMap(() => this.http.get(`${environment.apiUrl}/users`)),
        tap({
          next: (response: any) => {
            console.log('ini response users di add collaborator: ', response);
            this.users = response.data.users.filter((user: any) =>
              this.currentCollaborators.every(
                (collaborator) => user.id !== collaborator.user_id
              )
            );

            console.log('ini this user oioioi: ', this.users);
          },
          error: (response: any) => {
            console.log('ini response error add collaborator: ', response);
          },
        })
      )
      .subscribe();
  }

  onSubmit() {
    console.log('ini note id: ', this.noteId);
    console.log(
      'ini adalah value form dari collaborator id: ',
      this.userForm.value
    );

    this.store
      .select(selectAccessToken)
      .pipe(
        tap((accessToken: string | null) =>
          console.log('ini access token di add collaborator: ', accessToken)
        ),
        concatMap((accessToken: string | null) => {
          const headers: HttpHeaders = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
          });

          return this.http.post(
            `${environment.apiUrl}/collaborations`,
            {
              noteId: this.noteId,
              userId: this.userForm.value.selectedUser,
            },
            { headers }
          );
        }),
        tap((response: any) => {
          console.log('ini response add collaborator: ', response);
          this.router.navigate(['']);
        })
      )
      .subscribe();
  }
}
