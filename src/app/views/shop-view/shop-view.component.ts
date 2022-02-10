import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthLevel, AuthService, AuthUser} from 'src/app/common/auth.service';
import {NotificationService} from 'src/app/common/notification.service';
import {ShopEditDialog} from 'src/app/common/shop-edit-dialog/shop-edit-dialog.component';
import {Item, Order, Shop, ShopService} from 'src/app/common/shop.service';
import {ItemEditDialog} from './components/item-edit-dialog/item-edit-dialog.component';

@Component({
  selector: 'app-shop-view',
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.scss']
})
export class ShopViewComponent implements OnInit, OnDestroy {
  shop!: Shop
  items!: Item[]
  user: AuthUser | null = null
  canEdit = false

  nameFilter: string = ''
  tagsFilter: string[] = []
  allTags = new Set<string>()
  order: Order = {
    name: '',
    phone: '',
    address: '',
    items: []
  }

  subUser!: Subscription

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private shopService: ShopService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.shop = data['shop']
      this.shop.items.forEach(item => item.tags.forEach(tag => this.allTags.add(tag)))
      this.items = this.shop.items
      this.checkEdit()
    })
    this.subUser = this.authService.user.subscribe(user => {
      this.user = user
      this.checkEdit()
    })
  }

  ngOnDestroy(): void {
    if(this.subUser)
      this.subUser.unsubscribe()
  }

  checkEdit() {
      this.canEdit = !!this.user && (this.user.level === AuthLevel.Admin || 
                                     this.user.shopID === this.shop.id)
  }

  // Shop CRUD
  editShop() {
    this.dialog.open(ShopEditDialog, {
      data: this.shop
    }).afterClosed().subscribe(newShop => {
      this.shopService.updateShop(newShop.shop, newShop.image).subscribe({
        next: _ => {
          this.shop = newShop.shop
          this.notificationService.notify('Shop edited successfully!', 'success')
        },
        error: err =>
          this.notificationService.notify('Error editing shop: ' + err, 'danger')
      })
    })
  }

  deleteShop() {
    const confirmed = confirm('Do you really want to delete this shop?')
    if(confirmed) {
      this.shopService.deleteShop(this.shop.id).subscribe({
        next: _ => {
          this.notificationService.notify('Shop successfully deleted!', 'success')
          this.router.navigate(['/explore'])
        },
        error: err =>
          this.notificationService.notify('Error deleting shop: ' + err, 'danger')
      })
    }
  }

  // Item CRUD
  createItem() {
    const editDialog = this.dialog.open(ItemEditDialog, { })

    editDialog.afterClosed().subscribe(newItem => {
      if(newItem) {
        this.shopService.addItem(this.shop.id, newItem.item, newItem.image).subscribe({
          next: _ => {
            this.shop.items.push(newItem.item)
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
        this.shopService.editItem(this.shop.id, newItem.item, newItem.image).subscribe({
          next: _ => {
            const pos = this.shop.items.findIndex(i => i.name == item.name)
            if(pos != -1) {
              this.shop.items[pos] = newItem.item
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
