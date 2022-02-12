import { Component, Input, OnInit } from '@angular/core';
import {ScaleType} from '@swimlane/ngx-charts';
import {ShopService, ShopStatistics} from 'src/app/common/shop.service';

@Component({
  selector: 'app-order-statistics',
  templateUrl: './order-statistics.component.html',
  styleUrls: ['./order-statistics.component.scss']
})
export class OrderStatisticsComponent implements OnInit {
  @Input() shopID = ''

  data: any = []
  responseTime = ''

  hours = [...Array(24).keys()].map(i => `${i}h`)
  scheme = {
    selectable: false,
    name: 'custom',
    domain: ['#5566c3'],
    group: ScaleType.Linear
  }

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    //this.fillData([])
    if(this.shopID != '') {
      this.shopService.getShopStatistics(this.shopID).subscribe(res => {
        this.calcResponseTime(res.responseTime)
        this.fillData(res.ordersByHour)
      })
    }
  }

  fillData(stats: {hour: number, orders: number}[]) {
    const sorted = stats.sort((a,b) => a.hour - b.hour)
    const data = []
    for(let i = 0; i < 24; i++) {
      if(sorted.length > 0 && sorted[0].hour == i)
        data.push({name: `${i}h`, value: sorted.shift()?.orders})
      else
        data.push({name: `${i}h`, value: 0})
    }
    this.data = data
  }

  calcResponseTime(total: number) {
    const seconds = total % 60
    const minutes = total / 60 % 60
    const hours = total / 60 / 60
    let result = ''
    if(hours > 1)
      result += `${hours|0}h`
    if(minutes > 1)
      result += `${minutes|0}m`
    if(seconds > 1)
      result += `${seconds|0}s`
    this.responseTime = result
  }

  yAxisFormat(val: number) {
    if(val % 1 == 0)
      return val.toLocaleString()
    else
      return ''
  }
}
