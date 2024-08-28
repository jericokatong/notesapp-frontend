import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { CreateNoteComponent } from './create-note/create-note.component';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { AddCollaboratorComponent } from './add-collaborator/add-collaborator.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create-note',
    component: CreateNoteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-note/:id',
    component: EditNoteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-collaborator/:id',
    component: AddCollaboratorComponent,
    canActivate: [authGuard],
  },
];
