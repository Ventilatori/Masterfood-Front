import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopEditDialog } from './shop-edit-dialog.component';

describe('ShopEditDialog', () => {
  let component: ShopEditDialog;
  let fixture: ComponentFixture<ShopEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopEditDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
