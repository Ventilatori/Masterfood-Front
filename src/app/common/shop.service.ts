import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, take} from 'rxjs';
import {AuthLevel, AuthService} from './auth.service';

export interface Item {
  id?: string
  name: string
  description: string
  picture: string
  price: number
  amount: number
  tags: string[]
}

export interface Shop {
  id: string
  name: string
  description: string
  picture: string
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

export enum OrderType {
  Active,
  Done,
}

function translateError(err: any): Observable<any> {
  throw err.error.message
}

function transformItem(item: Item) {
  // TODO: Change to api after integration
  if(!item.tags) item.tags = []
  item.picture = '/realapi/Images/Item/' + item.picture
  return item
}

function transformShop(shop: Shop) {
  // TODO: Change to api after integration
  if(!shop.items) shop.items = []
  if(!shop.tags) shop.tags = []
  shop.picture = '/realapi/Images/Shop/' + shop.picture
  shop.items = shop.items.map(transformItem)
  return shop
}

@Injectable({providedIn: 'root'})
export class ShopService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Shop
  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>('/realapi/Shop').pipe(
      map(shops => shops.map(transformShop)),
      catchError(translateError)
    )
  }

  getPopularShops(): Observable<Shop[]> {
    // TODO: Temporary
    return this.getAllShops().pipe(
      map(shops => shops.slice(0, 6))
    )
  }

  getShop(id: string): Observable<Shop> {
    return this.http.get<Shop>('/realapi/shop/'+id).pipe(
      map(transformShop),
      catchError(translateError)
    )
  }

  searchShops(name: string, tags: string[]) {
    //TODO: Temporary
    return this.http.get<Shop[]>('/api/shop?name_like='+name+'&tags='+tags).pipe(
      map(shops => shops.map(transformShop))
    )
  }

  // Shop CRUD
  createShop(account: {name: string, pass: string}, shop: Shop, picture: File | undefined) {
    //TODO: return shop id
    const formData = new FormData()
    formData.append("userName", account.name)
    formData.append("password", account.pass)

    formData.append("name", shop.name)
    formData.append("description", shop.description)
    formData.append("tags", shop.tags.join(','))
    if(picture)
      formData.append("picture", picture)

    return this.http.post('/realapi/Shop', formData).pipe(catchError(translateError))
  }

  updateShop(shop: Shop, picture: File | undefined) {
    const formData = new FormData()
    formData.append("name", shop.name)
    formData.append("description", shop.description)
    formData.append("tags", shop.tags.join(','))
    if(picture)
      formData.append("picture", picture)
    return this.http.put('/realapi/Shop/' + shop.id, formData).pipe(catchError(translateError))
  }

  deleteShop(shopID: string) {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if(user && user.level == AuthLevel.ShopOwner)
        this.authService.logout()
    })
    return this.http.delete('/realapi/Shop/' + shopID)
  }

  // Item CRUD
  addItem(shopID: string, item: Item, picture: File | undefined) {
    const formData = new FormData()
    formData.append("name", item.name)
    formData.append("description", item.description)
    formData.append("tags", item.tags.join(','))
    if(picture)
      formData.append("picture", picture)
    formData.append("price", item.price.toString())

    return this.http.post('/realapi/Shop/' + shopID + '/Item', formData)
  }

  editItem(shopID: string, item: Item, picture: File | undefined) {
    const formData = new FormData()
    formData.append("name", item.name)
    formData.append("description", item.description)
    formData.append("tags", item.tags.join(','))
    if(picture)
      formData.append("picture", picture)
    formData.append("price", item.price.toString())

    return this.http.put('/realapi/Shop/' + shopID + '/Item', formData)
  }

  deleteItem(shopID: string, item: Item) {
    //TODO: Untested
    return this.http.delete('/api/Shop/' + shopID + '/Item' + item.id)
  }

  // Misc
  getPopularTags(): Observable<string[]> {
    // TODO: Temporary
    return this.http.get<string[]>('/api/popularTags')
  }

  // Order
  newOrder(id: string, order: Order) {
    return this.http.post('/api/shop/' + id + '/order', order)
  }

  getOrders(shopID: string, type: OrderType) {
    // TODO: Temporary
    return of([])
  }

  finishOrder(shopID: string, order: Order) {
    return of(true)
  }

  declineOrder(shopID: string, order: Order) {
    return of(true)
  }
}
