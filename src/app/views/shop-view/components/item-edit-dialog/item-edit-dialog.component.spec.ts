import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditDialog } from './item-edit-dialog.component';

describe('ItemEditDialog', () => {
  let component: ItemEditDialog;
  let fixture: ComponentFixture<ItemEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemEditDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
