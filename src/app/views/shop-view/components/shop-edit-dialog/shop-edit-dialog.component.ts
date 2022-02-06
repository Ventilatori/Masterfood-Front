import { Component, Inject, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Item} from 'src/app/common/shop.service';

@Component({
  selector: 'app-shop-edit-dialog',
  templateUrl: './shop-edit-dialog.component.html',
  styleUrls: ['./shop-edit-dialog.component.scss']
})
export class ShopEditDialog implements OnInit {
  item: Item = {
    name: '',
    description: '',
    image: '',
    price: 0,
    amount: 1,
    tags: [] as string[]
  }
  isNewItem = true

  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  priceFormControl = new FormControl('', [Validators.required,
                                          Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);

  constructor(
    public dialogRef: MatDialogRef<ShopEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {
    if(data) {
      this.item = {...data}
      this.item.tags = [...data.tags]
      this.isNewItem = false
    }
  }

  ngOnInit(): void {

  }

  onSubmit() {
    alert(this.item.tags)
  }
}
