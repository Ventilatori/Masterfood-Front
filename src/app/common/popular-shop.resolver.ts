import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {Shop, ShopService} from './shop.service';

@Injectable({providedIn: 'root'})
export class PopularShopResolver implements Resolve<Shop[]> {
  constructor(
    private shopService: ShopService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Shop[]> {
    return this.shopService.getPopularShops()
  }
}
