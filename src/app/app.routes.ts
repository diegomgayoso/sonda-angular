import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OfficialComponent } from './pages/official/official.component';
import { SicknotesComponent } from './pages/sicknotes/sicknotes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'edital', component: OfficialComponent },
  { path: 'atestados', component: SicknotesComponent }
];
