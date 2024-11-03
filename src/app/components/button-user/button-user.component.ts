import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../interfaces/users';

@Component({
  selector: 'app-button-user',
  standalone: true,
  imports: [MatMenuModule, MatIconModule],
  templateUrl: './button-user.component.html',
  styleUrl: './button-user.component.scss'
})
export class ButtonUserComponent {
  @Input() user!: User | null;
  constructor() { }
  logout(){
    console.log('logout');

  }
}
