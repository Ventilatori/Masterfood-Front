import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Item, Order} from 'src/app/common/shop.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input() order: Order = {
    name: '',
    phone: '',
    address: '',
    items: []
  }
  @Output() orderChange = new EventEmitter<Order>()
  @Output() submitOrder = new EventEmitter()

  nameFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  phoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);

  constructor() { }

  ngOnInit(): void {
  }

  // TODO: REMOVE
  // updateOrderItems(order: Order) {
  //   const count: {[key: string]: number} = {}
  //   const val: {[key: string]: {amount: number, item: Item}} = {}
  //   this.order.items.forEach(item => {
  //     count[item.name] = (count[item.name]||0) + 1
  //     val[item.name] = {amount: count[item.name], item: item}
  //   });
  //   //this.orderItems = Object.values(val)
  //   //return this.orderItems
  //   return Object.values(val)
  // }

  addItem(target: Item) {
    // TODO: Change to id?
    const item = this.order.items.find(item => item.name === target.name)
    if(item != undefined) {
      item.amount += 1
    }
    else {
      this.order.items.push(target) 
    }
    this.orderChange.emit(this.order)
  }

  removeItem(target: Item) {
    const pos = this.order.items.findIndex(item => item.name == target.name)
    if(pos != -1) {
      const item = this.order.items[pos]
      item.amount -= 1
      if(item.amount <= 0) {
        this.order.items.splice(pos, 1)
      }
    }
    this.orderChange.emit(this.order)
  }

  getOrderTotal() {
    return this.order.items.reduce((total: number, item: Item) => total += (item.price * item.amount), 0) 
  }

  isOrderValid() {
    return (this.nameFormControl.valid &&
            this.addressFormControl.valid &&
            this.phoneFormControl.valid &&
            this.order.items.length > 0)
  }

  onSubmit() {
    if(this.isOrderValid()) {
      this.submitOrder.emit()
    }
  }
}
