import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreViewComponent } from './explore-view.component';

describe('ExploreViewComponent', () => {
  let component: ExploreViewComponent;
  let fixture: ComponentFixture<ExploreViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
