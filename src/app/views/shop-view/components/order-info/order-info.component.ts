import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {interval, mergeMap, Subscription} from 'rxjs';
import {NotificationService} from 'src/app/common/notification.service';
import {OrderType, ShopService} from 'src/app/common/shop.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit, OnDestroy {
  OrderType = OrderType
  reloadTime = 30*1000

  @Input() shopID = ''

  orders = [
    {
      name: 'Janko',
      address: 'test',
      phone: '061231233',
      items: [
        {name: 'Jabuka', amount: 3, price: 80}
      ] 
    },
    {
      name: 'Danko',
      address: 'test',
      phone: '061231233',
      items: [
        {name: 'Jabuka', amount: 3, price: 80},
        {name: 'Kruska', amount: 3, price: 80}
      ] 
    }
  ]
  showOrders = OrderType.Active
  subUpdate!: Subscription

  constructor(
    private shopService: ShopService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    console.log(this.shopID)
    this.subUpdate = interval(this.reloadTime).subscribe(_ => this.updateList())
    this.updateList()
  }

  toggleOrderType() {
    this.showOrders = this.showOrders === OrderType.Active? OrderType.Done : OrderType.Active
    this.updateList()
  }

  updateList() {
    // TODO: Uncomment this when API is done.
    this.shopService.getOrders(this.shopID, this.showOrders).subscribe({
      next: res => {}, //this.orders = res,
      error: err =>
        this.notificationService.notify('Error updating order list: ' + err, 'danger')
    })
  }

  ngOnDestroy() {
    if(this.subUpdate)
      this.subUpdate.unsubscribe()
  }
}
