import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
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
          this.router.navigate(['edital']);
          console.log(this.currentUser, this.isLoggedIn());

        } else {
          this.currentUser = null;
          this.router.navigate(['login']);
          alert('Usuário ou senha inválidos');
        }
      }
    })
  }
  setUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  logout() {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }


}
