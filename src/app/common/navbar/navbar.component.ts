import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthDialog} from '../auth-dialog/auth-dialog.component';
import {AuthService, AuthUser, AuthLevel} from '../auth.service';
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
  Position = Position
  AuthLevel = AuthLevel
  subUser!: Subscription
  auth = AuthLevel.Guest
  loggedIn = false
  user: AuthUser | null = null

  logo = {
    text: 'Shop4Me',
    icon: 'shopping_basket'
  }

  allLinks: Link[] = [
    { name: "Explore", link: "/explore", icon: "explore", pos: Position.Left },
    { name: "Search", link: "/search", icon: "search", pos: Position.Left },
    { name: "New Shop", click: () => this.onNewShop(), icon: "person_add", pos: Position.Right, auth: AuthLevel.Admin },
    { name: "My Shop", click: () => this.onMyShop(), icon: "person", pos: Position.Right, auth: AuthLevel.ShopOwner },
    { name: "Personnel", click: () => this.onAuth(), icon: "login", loggedIn: false, pos: Position.Right },
    { name: "Log out", click: () => this.onLogOut(), icon: "logout", loggedIn: true, pos: Position.Right },
  ]
  links: Link[] = []

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private authService: AuthService,
    private shopService: ShopService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.subUser = this.authService.user.subscribe(user => {
      this.loggedIn = !!user
      this.auth = user? user.level : AuthLevel.Guest
      this.user = user
      this.links = 
        this.allLinks.filter(l => l.auth === undefined || this.auth === l.auth)
                     .filter(l => l.loggedIn === undefined || l.loggedIn === this.loggedIn)
    })
  }

  ngOnDestroy() {
    this.subUser.unsubscribe()
  }

  getLinksForPosition(pos: Position) {
    return this.links.filter(l => l.pos === pos) 
  }

  onAuth() {
    this.dialog.open(AuthDialog, {
      width: '300px'
    });
  }

  onLogOut() {
    this.authService.logout()
  }

  onNewShop() {
    this.dialog.open(ShopEditDialog, {}).afterClosed().subscribe(res => {
      this.shopService.createShop(res.account, res.shop, res.image).subscribe({
        next: _ => {
          //TODO: Redirect
          this.notificationService.notify('Shop created successfully!', 'success')
        },
        error: err =>
          this.notificationService.notify('Shop creation failed: ' + err, 'danger')
      })
    })
  }

  onMyShop() {
    if(this.user && this.user.shopID)
      this.router.navigate(['/shop', this.user.shopID])
  }
}
