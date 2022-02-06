import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if(params['tag'])
        this.tagsFilter = params['tag'].split(',')
      this.search()
    })
  }

  updateFilter(name: string, tags: string[]) {
    this.nameFilter = name.toLowerCase()
    this.tagsFilter = tags.map(tag => tag.toLowerCase())
    this.search()
  }

  search() {
    this.shopService.search(this.nameFilter, this.tagsFilter).subscribe(res => {
      this.shops = res
    })
  }

  addTag(tag: string) {
    this.tagsFilter.push(tag)
  }
}
