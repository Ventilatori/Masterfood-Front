import { Component, Inject, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Item} from 'src/app/common/shop.service';

@Component({
  selector: 'app-item-edit-dialog',
  templateUrl: './item-edit-dialog.component.html',
  styleUrls: ['./item-edit-dialog.component.scss']
})
export class ItemEditDialog implements OnInit {
  item: Item = {
    name: '',
    description: '',
    image: '',
    price: 0,
    amount: 1,
    tags: [] as string[]
  }
  
  isNewItem = true

  imageFile: File | undefined = undefined

  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  priceFormControl = new FormControl('', [Validators.required,
                                          Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);

  constructor(
    public dialogRef: MatDialogRef<ItemEditDialog>,
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

  isItemValid() {
    return (this.nameFormControl.valid &&
            this.descFormControl.valid &&
            this.priceFormControl.valid)
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
        this.item.image = reader.result as string
      })
    }
  }

  onSubmit() {
    this.dialogRef.close(this.item)
  }
}
