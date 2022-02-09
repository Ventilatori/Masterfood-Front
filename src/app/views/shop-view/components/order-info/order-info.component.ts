import { Component, OnInit } from '@angular/core';
import {Item} from 'src/app/common/shop.service';

enum OrderType {
  Active,
  Done,
}

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {
  OrderType = OrderType

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
      name: 'Janko',
      address: 'test',
      phone: '061231233',
      items: [
        {name: 'Jabuka', amount: 3, price: 80},
        {name: 'Kruska', amount: 3, price: 80}
      ] 
    }
  ]

  showOrders = OrderType.Active

  constructor() { }

  ngOnInit(): void {
  }

  toggleOrderType() {
    this.showOrders = this.showOrders === OrderType.Active? OrderType.Done : OrderType.Active
  }
}
