import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NotificationService} from '../notification.service';
import {ShopEditDialog} from '../shop-edit-dialog/shop-edit-dialog.component';
import {ShopService} from '../shop.service';
// import {AuthDialogComponent, AuthType} from '../auth/auth-dialog/auth-dialog.component';
// import {AuthService, AuthUser} from '../auth/auth.service';
// import {User} from '../models/user.model';

enum Position {
  Left,
  Right
}

// TODO: Move to authService
enum AuthLevel {
  Guest = 0,
  User = 1,
  ShopOwner = 2,
  Admin = 3
}
enum AuthType {
  Login,
  Register
}

interface Link {
  name: string,
  link?: string,
  click?: () => any,
  icon: string,
  loggedIn?: boolean,
  pos: Position,
  auth?: AuthLevel
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // AuthType = AuthType
  Position = Position
  AuthLevel = Position
  subUser!: Subscription
  auth = AuthLevel.Admin
  loggedIn = true
  // user: AuthUser | null = null

  logo = {
    text: 'Shop4Me',
    icon: 'shopping_basket'
  }

  allLinks: Link[] = [
    { name: "Explore", link: "/explore", icon: "explore", pos: Position.Left },
    { name: "Search", link: "/search", icon: "search", pos: Position.Left },
    { name: "New Shop", click: () => this.onNewShop(), icon: "person_add", pos: Position.Right, auth: AuthLevel.Admin },
    { name: "Personnel", click: () => this.onAuth(AuthType.Login), icon: "login", loggedIn: false, pos: Position.Right },
    { name: "Log out", click: () => this.onLogOut(), icon: "logout", loggedIn: true, pos: Position.Right },
    // { name: "Register", click: () => this.onAuth(AuthType.Register), icon: "person_add", loggedIn: false, pos: Position.Right },
    // { name: "Profile", click: () => this.gotoProfile(), icon: "person", loggedIn: true, pos: Position.Right },
  ]
  links: Link[] = []

  constructor(
    public dialog: MatDialog,
    // private authService: AuthService,
    private shopService: ShopService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    // this.subUser = this.authService.user.subscribe(user => {
    //   this.loggedIn = !!user
    //   this.user = user
    //   this.links = this.allLinks.filter(l => l.loggedIn === undefined || l.loggedIn === this.loggedIn)
    // })
    // TODO: Integrate with AuthService
    this.links = this.allLinks.filter(l => l.auth === undefined || this.auth >= l.auth)
                              .filter(l => l.loggedIn === undefined || l.loggedIn === this.loggedIn)
  }

  ngOnDestroy() {
    // this.subUser.unsubscribe()
  }

  getLinksForPosition(pos: Position) {
    return this.links.filter(l => l.pos === pos) 
  }

  // TODO: Copy over from prev project
  onAuth(type: AuthType): void {
  // this.dialog.open(AuthDialogComponent, {
  //   width: '250px',
  //   data: type,
  // });
  }

  onLogOut() {

  }

  onNewShop() {
    this.dialog.open(ShopEditDialog, {}).afterClosed().subscribe(res => {
      this.shopService.createShop(res.account, res.shop).subscribe({
        next: res => {
          // TODO: Redirect
          this.notificationService.notify('Shop created successfully!', 'success')
        },
        error: err =>
          this.notificationService.notify('Shop creatin failed: ' + err, 'danger')
      })
    })
  }

  gotoProfile(): void {
    // if(this.user)
    //   this.router.navigate(['/user', this.user.name])
  }
}
