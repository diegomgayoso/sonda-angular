import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OfficialComponent } from './main/official/official.component';
import { SicknotesComponent } from './main/sicknotes/sicknotes.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: MainComponent, children: [
      { path: 'edital', component: OfficialComponent },
      { path: 'atestados', component: SicknotesComponent }
    ]
  }
];
