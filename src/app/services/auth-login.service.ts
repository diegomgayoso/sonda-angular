import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {

  private apiUsers = 'http://localhost:3000/users';
  currentUser!: User | null;
  constructor(private http: HttpClient, private router: Router) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUsers);
  }

  login(credentials: { email: string, password: string }) {
    return this.http.get<User[]>(this.apiUsers).subscribe({
      next: (users) => {
        const user = users.find(user => user.email === credentials.email && user.password === credentials.password);
        if (user) {
          this.currentUser = user;
          this.router.navigate(['/']);
        } else {
          this.currentUser = null;
          this.router.navigate(['login']);
          alert('Usuário ou senha inválidos');
        }
      }
    })
  }
  logout() {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
