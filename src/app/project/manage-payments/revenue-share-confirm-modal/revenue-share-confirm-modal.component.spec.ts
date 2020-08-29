import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueShareConfirmModalComponent } from './revenue-share-confirm-modal.component';

describe('RevenueShareConfirmModalComponent', () => {
  let component: RevenueShareConfirmModalComponent;
  let fixture: ComponentFixture<RevenueShareConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueShareConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueShareConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
