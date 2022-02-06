import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Data} from '@angular/router';
import {NotificationService} from 'src/app/common/notification.service';
import {Item, Order, Shop, ShopService} from 'src/app/common/shop.service';
import {ItemEditDialog} from './components/item-edit-dialog/item-edit-dialog.component';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.scss']
})
export class ShopViewComponent implements OnInit {
  shop!: Shop
  items!: Item[]
  canEdit = true

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
    private dialog: MatDialog,
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

  // Item CRUD
  createItem() {
    const editDialog = this.dialog.open(ItemEditDialog, { })

    editDialog.afterClosed().subscribe(newItem => {
      if(newItem) {
        this.shopService.addItem(this.shop.id, newItem).subscribe({
          next: _ => {
            this.shop.items.push(newItem)
            this.search()
            this.notificationService.notify('Item successfully added!', 'success')
          },
          error: err => 
            this.notificationService.notify('Error while editing item: ' + err, 'danger')
        })
      }
    }) 
  }

  deleteItem(item: Item) {
    this.shopService.deleteItem(this.shop.id, item).subscribe({
      next: _ => {
        const pos = this.shop.items.findIndex((i) => i.name == item.name)
        this.shop.items.splice(pos, 1)
        this.search()
        this.notificationService.notify('Item deleted successfully', 'success')
      },
      error: err =>
        this.notificationService.notify('Error deleting the item: ' + err, 'danger')
    })
  }

  editItem(item: Item) {
    const editDialog = this.dialog.open(ItemEditDialog, {
      data: item
    })

    editDialog.afterClosed().subscribe(newItem => {
      if(newItem) {
        this.shopService.editItem(this.shop.id, newItem).subscribe({
          next: _ => {
            const pos = this.shop.items.findIndex(i => i.name == item.name)
            if(pos != -1) {
              this.shop.items[pos] = newItem
            }
            this.search()
            this.notificationService.notify('Item successfully edited!', 'success')
          },
          error: err => 
            this.notificationService.notify('Error while editing item: ' + err, 'danger')
        })
      }
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
  orderItem(target: Item) {
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
