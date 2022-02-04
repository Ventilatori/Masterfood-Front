import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {NotificationService} from 'src/app/notification.service';
import {Item, Order, Shop, ShopService} from '../shop.service';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.scss']
})
export class ShopViewComponent implements OnInit {
  shop!: Shop
  items!: Item[]
  nameFilter: string = ''
  tagsFilter: string[] = []
  allTags = new Set<string>()
  order: Order = {
    name: '',
    phone: '',
    address: '',
    items: []
  }

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.shop = data['shop']
      this.shop.items.forEach(item => item.tags.forEach(tag => this.allTags.add(tag)))
      this.items = this.shop.items
    })
  }

  // Search Related
  updateFilter(name: string, tags: string[]) {
    this.nameFilter = name.toLowerCase()
    this.tagsFilter = tags.map(tag => tag.toLowerCase())
    this.search()
  }

  addTag(tag: string) {
    this.tagsFilter.push(tag)
    this.search()
  }

  search() {
    this.items = this.shop.items.filter(item => {
      return (item.name.toLowerCase().includes(this.nameFilter) &&
              this.tagsFilter.every(tag => item.tags.includes(tag)))
    })
  }

  // Order Related
  addItem(target: Item) {
    const item = this.order.items.find(item => item.name === target.name)
    if(item != undefined) {
      item.amount += 1
    }
    else {
      this.order.items.push({...target}) 
    }
  }

  onSubmitOrder() {
    this.shopService.newOrder(this.shop.id, this.order).subscribe({
      next: _ => 
        this.notificationService.notify('Order placed successfully!', 'success'),
      error: err => {
        this.notificationService.notify('There was a problem while placing your order: ' + err.message, 'danger')
      }
    })
  }
}