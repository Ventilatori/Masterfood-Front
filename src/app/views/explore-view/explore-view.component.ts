import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Shop} from 'src/app/common/shop.service';

@Component({
  selector: 'app-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss']
})
export class ExploreViewComponent implements OnInit {
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
