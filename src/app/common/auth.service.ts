import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, exhaustMap, map, Observable, of, tap} from 'rxjs';

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

function translateError(err: any): Observable<any> {
  throw err.error.message
}

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
    // TODO: Temporary
    if(username == 'fakeadmin') {
      this.user.next(this.adminUser)
      return of(this.adminUser)
    }
    else if(username == 'fakeshop') {
      this.user.next(this.ownerUser)
      return of(this.ownerUser)
    }

    return this.http.put<AuthUser>('/realapi/Auth/LogIn', {
      userName: username,
      password: password
    }).pipe(
      tap(user => {
        this.user.next(user)
        localStorage.setItem("auth", JSON.stringify(user))
      }),
      catchError(translateError)
    )
  }

  logout() {
    this.http.put('/realapi/Auth/LogOut', {}).subscribe(_ => {})
    localStorage.removeItem("auth")
    this.user.next(null)
  }

}
