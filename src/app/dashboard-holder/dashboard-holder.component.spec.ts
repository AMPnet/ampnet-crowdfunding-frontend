import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHolderComponent } from './dashboard-holder.component';

describe('DashboardHolderComponent', () => {
  let component: DashboardHolderComponent;
  let fixture: ComponentFixture<DashboardHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
