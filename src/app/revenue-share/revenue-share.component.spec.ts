import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueShareComponent } from './revenue-share.component';

describe('RevenueShareComponent', () => {
  let component: RevenueShareComponent;
  let fixture: ComponentFixture<RevenueShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
