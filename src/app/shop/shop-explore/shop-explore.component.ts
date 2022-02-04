import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Shop} from '../shop.service';

@Component({
  selector: 'app-shop-explore',
  templateUrl: './shop-explore.component.html',
  styleUrls: ['./shop-explore.component.scss']
})
export class ShopExploreComponent implements OnInit {
  shops: Shop[] = []

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.shops = data['popular']
    })
  }

  getTagList(tags: string[]): string[] {
    if(tags.length > 3) 
      return [...tags.slice(0, 2), `+${tags.length-2}`]
    else
      return tags
  }
}
