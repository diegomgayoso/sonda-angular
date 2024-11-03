import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonUserComponent } from "../button-user/button-user.component";
import { AuthLoginService } from '../../services/auth-login.service';
import { User } from '../../interfaces/users';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonUserComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn: boolean = true;
  user!: User | null;
  constructor(private authService: AuthLoginService) { }
  ngOnInit(): void {
    if(this.authService.isLoggedIn() == true){
      this.isLoggedIn = true;
      this.user = this.authService.currentUser
    }else {
      this.isLoggedIn = false;
    }
  }
}
