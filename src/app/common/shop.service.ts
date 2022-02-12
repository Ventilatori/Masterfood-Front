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

export interface OrderList {
  id?: string
  active: Order[]
  history: Order[]
}

export interface ShopStatistics {
  ordersByHour: {hour: number, orders: number}[]
  responseTime: number
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
  // TODO: Change to api after integration
  public defaultItemImage = '/realapi/Images/Item/default.png'
  public defaultShopImage = '/realapi/Images/Shop/default.png'

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
    return this.http.get<Shop[]>('/realapi/Shop/Popular').pipe(
      map(shops => shops.map(transformShop)),
      catchError(translateError)
    )
  }

  getShop(id: string): Observable<Shop> {
    return this.http.get<Shop>('/realapi/Shop/'+id).pipe(
      map(transformShop),
      catchError(translateError)
    )
  }

  searchShops(name: string, tags: string[]) {
    tags = tags.map(tag => `"${tag}"`)
    return this.http.post<Shop[]>('/realapi/Shop/Search', {name: name, tags: tags}).pipe(
      map(shops => shops.map(transformShop)),
      catchError(translateError)
    )
  }

  getShopStatistics(shopID: string): Observable<ShopStatistics> {
    return this.http.get<ShopStatistics>(`/realapi/Shop/${shopID}/Statistics`).pipe(
      catchError(translateError)
    )
  }

  // Shop CRUD
  createShop(account: {name: string, pass: string}, shop: Shop, picture: File | undefined) {
    const formData = new FormData()
    formData.append("userName", account.name)
    formData.append("password", account.pass)

    formData.append("name", shop.name)
    formData.append("description", shop.description)
    formData.append("tags", shop.tags.join(','))
    if(picture)
      formData.append("picture", picture)

    return this.http.post<{shopID: string}>('/realapi/Shop', formData)
                    .pipe(catchError(translateError))
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
    return this.http.delete('/realapi/Shop/' + shopID).pipe(
      catchError(translateError)
    )
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

    return this.http.post('/realapi/Shop/' + shopID + '/Item', formData).pipe(
      catchError(translateError)
    )
  }

  editItem(shopID: string, item: Item, picture: File | undefined) {
    const formData = new FormData()
    formData.append("name", item.name)
    formData.append("description", item.description)
    formData.append("tags", item.tags.join(','))
    if(picture)
      formData.append("picture", picture)
    formData.append("price", item.price.toString())

    return this.http.put(`/realapi/Shop/${shopID}/Item/${item.id}`, formData).pipe(
      catchError(translateError)
    )
  }

  deleteItem(shopID: string, item: Item) {
    return this.http.delete(`/realapi/Shop/${shopID}/Item/${item.id}`).pipe(
      catchError(translateError)
    )
  }

  // Order
  newOrder(shopID: string, order: Order) {
    return this.http.post(`/realapi/Shop/${shopID}/order`, order).pipe(
      catchError(translateError)
    )
  }

  getOrders(shopID: string, type: OrderType) {
    return this.http.get<OrderList>(`/realapi/Shop/${shopID}/Order`).pipe(
      map(orderlist => type == OrderType.Active? orderlist.active : orderlist.history),
      catchError(translateError)
    )
  }

  finishOrder(shopID: string, order: Order) {
    return this.http.put(`/realapi/Shop/${shopID}/Order/${order.id}/Complete`, {}).pipe(
      catchError(translateError)
    )
  }

  declineOrder(shopID: string, order: Order) {
    return this.http.delete(`/realapi/Shop/${shopID}/Order/${order.id}/Abort`, {}).pipe(
      catchError(translateError)
    )
  }

  // Misc
  getPopularTags(): Observable<string[]> {
    return this.http.get<{name: string}[]>('/realapi/Shop/PopularTags').pipe(
      map(tags => tags.map(tag => tag.name)),
      catchError(translateError)
    )
  }

  getAllTags(): Observable<string[]> {
    return this.http.get<string[]>('/realapi/Shop/Tags').pipe(
      catchError(translateError)
    )
  }
}
