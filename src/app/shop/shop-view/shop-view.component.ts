import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
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
  orderItems: {item: Item, amount: number}[] = []

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.shop = data['shop']
      this.shop.items.forEach(item => item.tags.forEach(tag => this.allTags.add(tag)))
      this.items = this.shop.items
    })
  }

  updateFilter(name: string, tags: string[]) {
    this.nameFilter = name.toLowerCase()
    this.tagsFilter = tags.map(tag => tag.toLowerCase())
    this.search()
  }

  search() {
    this.items = this.shop.items.filter(item => {
      return (item.name.toLowerCase().includes(this.nameFilter) &&
              this.tagsFilter.every(tag => item.tags.includes(tag)))
    })
  }

  addTag(tag: string) {
    this.tagsFilter.push(tag)
    this.search()
  }

  addItem(item: Item) {
    this.order.items.push(item)
    this.updateOrderItems()
  }

  removeItem(targetItem: Item) {
    const pos = this.order.items.findIndex(item => item.name == targetItem.name)
    if(pos != -1)
      this.order.items.splice(pos, 1)
    this.updateOrderItems()
  }

  updateOrderItems() {
    const count: {[key: string]: number} = {}
    const val: {[key: string]: {amount: number, item: Item}} = {}
    this.order.items.forEach(item => {
      count[item.name] = (count[item.name]||0) + 1
      val[item.name] = {amount: count[item.name], item: item}
    });
    this.orderItems = Object.values(val)
  }
}
