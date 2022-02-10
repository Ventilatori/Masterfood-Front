import { Component, Inject, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Shop} from '../shop.service';

@Component({
  selector: 'app-shop-edit-dialog',
  templateUrl: './shop-edit-dialog.component.html',
  styleUrls: ['./shop-edit-dialog.component.scss']
})
export class ShopEditDialog implements OnInit {
  shop: Shop = {
    id: '',
    name: '',
    description: '',
    picture: '',
    items: [],
    tags: []
  }
  account = {
    name: '',
    pass: ''
  }

  isNewShop = true
  imageFile: File | undefined = undefined

  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  usernameFormControl = new FormControl('', [Validators.required]);
  passFormControl = new FormControl('', [Validators.required]);
  hide = true

  constructor(
    public dialogRef: MatDialogRef<ShopEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Shop
  ) {
    if(data) {
      this.shop = {...data}
      this.shop.tags = [...data.tags]
      this.isNewShop = false
    }
  }

  ngOnInit(): void {
  }

  isShopValid() {
    return (this.nameFormControl.valid &&
            this.descFormControl.valid) &&
           (!this.isNewShop || (this.usernameFormControl.valid &&
                                this.passFormControl.valid))
  }

  onFileUpload(eventTarget: EventTarget | null) {
    const fileInput = eventTarget as HTMLInputElement
    console.log([fileInput])
    //this.item.image = eventTarget.files?.item(0)
    if(fileInput.files && fileInput.files[0]) {
      this.imageFile = fileInput.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(fileInput.files[0])
      reader.addEventListener("load", _ => {
        // For preview
        this.shop.picture = reader.result as string
      })
    }
  }

  onSubmit() {
    if(this.isNewShop) {
      this.dialogRef.close({shop: this.shop, 
                            account: this.account, 
                            image: this.imageFile})
    } else {
      this.dialogRef.close({shop: this.shop, 
                            image: this.imageFile})
    }
  }
}
