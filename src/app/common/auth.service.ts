import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, exhaustMap, map, Observable, of, tap} from 'rxjs';

export interface AuthUser {
  id: string
  userName: string
  token: string
};

// Separate into shared folder
interface Message {
  message: string
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<AuthUser | null>(null)

  constructor(private http: HttpClient) { }

  getFromStorage() {
    const auth = localStorage.getItem("auth")
    if(auth) { 
      const obj = JSON.parse(auth)
      this.user.next(obj)
    }
  }

  login(username: string, password: string): Observable<AuthUser> {
    const formData = new FormData()
    formData.append("userName", username)
    formData.append("password", password)
    return this.http.post<AuthUser>('/api/Auth/LogIn', formData).pipe(
      tap(user => {
        this.user.next(user)
        localStorage.setItem("auth", JSON.stringify(user))
      })
    )
  }

  logout() {
    this.http.post('/api/Auth/LogOut', {}).subscribe(_ => {})
    localStorage.removeItem("auth")
    this.user.next(null)
  }

}
