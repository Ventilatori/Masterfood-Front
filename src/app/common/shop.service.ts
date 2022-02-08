import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, of} from 'rxjs';

export interface Item {
  id?: string
  name: string
  description: string
  image: string
  price: number
  amount: number
  tags: string[]
}

export interface Shop {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
  items: Item[]
}

export interface Order {
  id?: string
  name: string
  address: string
  phone: string
  orderTime?: string
  finished?: boolean
  items: Item[]
}

@Injectable({providedIn: 'root'})
export class ShopService {
  constructor(
    private http: HttpClient
  ) { }

  // Shop
  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>('/api/shop')
  }

  getPopularShops(): Observable<Shop[]> {
    // TODO: Temporary
    return this.getAllShops().pipe(
      map(shops => shops.slice(0, 6))
    )
  }

  getShop(id: string): Observable<Shop> {
    return this.http.get<Shop>('/api/shop/'+id)
  }

  searchShops(name: string, tags: string[]) {
    //TODO: Temporary
    return this.http.get<Shop[]>('/api/shop?name_like='+name+'&tags='+tags)
  }

  // Shop CRUD
  createShop(account: {name: string, pass: string}, shop: Shop) {
    //TODO: Temporary
    return of(true)
  }

  updateShop(shop: Shop) {
    //TODO: Temporary
    return of(true)
  }

  deleteShop(shopID: string) {
    //TODO: Temporary
    return of(true)
  }

  // Item CRUD
  addItem(shopID: string, item: Item) {
    //TODO: Temporary
    return of(true)
  }

  editItem(shopID: string, item: Item) {
    //TODO: Temporary
    return of(true)
  }

  deleteItem(shopID: string, item: Item) {
    //TODO: Temporary
    return of(true)
  }

  // Order
  newOrder(id: string, order: Order) {
    return this.http.post('/api/shop/' + id + '/order', order)
  }

  // Misc
  getPopularTags(): Observable<string[]> {
    // TODO: Temporary
    return this.http.get<string[]>('/api/popularTags')
  }

}
