import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/common/auth.service';
import {NotificationService} from 'src/app/common/notification.service';
import {Shop, ShopService} from 'src/app/common/shop.service';

@Component({
  selector: 'app-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss']
})
export class ExploreViewComponent implements OnInit {
  nearShops: Shop[] = []
  popularShops: Shop[] = []
  tags: string[] = []

  constructor(
    private shopService: ShopService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.shopService.getPopularShops().subscribe({
      next: res => this.popularShops = res,
      error: err => 
        this.notificationService.notify('Error fetching popular shops: ' + err, 'danger')
    })
    this.authService.getLocation().subscribe({
      next: pos => 
        this.shopService.getNearShops(pos).subscribe(res => this.nearShops = res),
      error: err =>
        this.notificationService.notify('Error fetching nearby shops: ' + err, 'danger')
    })
    this.shopService.getPopularTags().subscribe({
      next: res => this.tags = res,
      error: err =>
        this.notificationService.notify('Error fetching popular tags: ' + err, 'danger')
    })
  }

  onTagClicked(tag: string) {
    this.router.navigate(['/search'], { queryParams: {tag: tag} })    
  }
}
