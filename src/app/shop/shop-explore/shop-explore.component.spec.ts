import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantExploreComponent } from './restaurant-explore.component';

describe('RestaurantExploreComponent', () => {
  let component: RestaurantExploreComponent;
  let fixture: ComponentFixture<RestaurantExploreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantExploreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
