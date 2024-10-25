import { Routes } from '@angular/router';
// import { AuthGuard, authGuard } from './guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { OfficialComponent } from './main/official/official.component';
import { SicknotesComponent } from './main/sicknotes/sicknotes.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    // Comentário para ter acesso livre as rotas
    // canActivate: [authGuard],
    // canActivateChild: [authGuard],
    component: MainComponent,
    children: [
      {
        path: 'edital',
        component: OfficialComponent,

      },
      {
        path: 'atestados',
        component: SicknotesComponent,

      }
    ],
  }
];
