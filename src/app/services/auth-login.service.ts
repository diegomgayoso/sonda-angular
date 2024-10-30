import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  id: number;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  private usersList = [
    { id: 1, email: 'teste@teste.com', password: 'senha123' },
    { id: 2, email: 'diego@teste.com', password: '123456' },
  ];

  private authenticatedUser: boolean = false;
  currentUser!: User | null;
  router = inject(Router);
  constructor() { }

  login(credentials: { email: string, password: string }) {
    const user = this.usersList.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      this.currentUser = user;
      this.authenticatedUser = true;
      this.router.navigate(['edital'])
    } else {
      this.authenticatedUser = false;
    }
  }
  logout() {
    this.authenticatedUser = false;
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.authenticatedUser;
  }
}
