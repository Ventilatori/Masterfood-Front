import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Shop} from '../shop.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  @Input() shops: Shop[] = []
  @Output() tagClicked = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  onTagClicked(tag: string) {
    this.tagClicked.emit(tag)
  }
}
