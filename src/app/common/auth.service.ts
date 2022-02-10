import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, exhaustMap, map, Observable, of, tap} from 'rxjs';

export interface AuthUser {
  id: string
  userName: string
  token: string
  level: AuthLevel
  shopID?: string
};

export enum AuthLevel {
  ShopOwner,
  Admin,
  Guest
}

// Separate into shared folder
interface Message {
  message: string
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<AuthUser | null>(null)

  adminUser = { id: '0', userName: 'Admin', token: 'a', level: AuthLevel.Admin }
  ownerUser = { id: '0', userName: 'Shop', token: 'b', level: AuthLevel.ShopOwner, shopID: '0'}

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

    // TODO: Temporary
    if(username == 'admin') {
      this.user.next(this.adminUser)
      return of(this.adminUser)
    }
    else if(username == 'shop') {
      this.user.next(this.ownerUser)
      return of(this.ownerUser)
    }

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
