import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Shop, ShopService} from 'src/app/common/shop.service';

enum PageTab {
  Shops = 0,
  Tags = 1
}

@Component({
  selector: 'app-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss']
})
export class ExploreViewComponent implements OnInit {
  shops: Shop[] = []
  tags: string[] = []

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    this.shopService.getPopularShops().subscribe(res => this.shops = res)
    this.shopService.getPopularTags().subscribe(res => this.tags = res)
  }
}
