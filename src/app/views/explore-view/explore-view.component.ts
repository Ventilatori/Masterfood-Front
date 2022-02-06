import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Shop, ShopService} from 'src/app/common/shop.service';

@Component({
  selector: 'app-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss']
})
export class ExploreViewComponent implements OnInit {
  shops: Shop[] = []
  tags: string[] = []

  constructor(
    private shopService: ShopService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.shopService.getPopularShops().subscribe(res => this.shops = res)
    this.shopService.getPopularTags().subscribe(res => this.tags = res)
  }

  onTagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: {tag: tag} })    
  }
}
