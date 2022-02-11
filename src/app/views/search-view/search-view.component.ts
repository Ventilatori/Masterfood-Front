import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NotificationService} from 'src/app/common/notification.service';
import {Shop, ShopService} from 'src/app/common/shop.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {
  shops: Shop[] = []

  nameFilter: string = ''
  tagsFilter: string[] = []
  allTags: Set<string> = new Set()

  constructor(
    private shopService: ShopService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['tag'])
        this.tagsFilter = params['tag'].split(',')
      this.search()
    })
    this.shopService.getAllTags().subscribe({
      next: res => { this.allTags = new Set(res); console.log(res)},
      error: err =>
        this.notificationService.notify('Error fetching tags: ' + err, 'danger')
    })
  }

  updateFilter(name: string, tags: string[]) {
    this.nameFilter = name.toLowerCase()
    this.tagsFilter = tags.map(tag => tag.toLowerCase())
    this.search()
  }

  addTag(tag: string) {
    this.tagsFilter.push(tag)
    this.search()
  }

  search() {
    this.shopService.searchShops(this.nameFilter, this.tagsFilter).subscribe(res => {
      this.shops = res
    })
  }
}
