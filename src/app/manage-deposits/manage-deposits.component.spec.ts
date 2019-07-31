import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepositsComponent } from './manage-deposits.component';

describe('ManageDepositsComponent', () => {
  let component: ManageDepositsComponent;
  let fixture: ComponentFixture<ManageDepositsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDepositsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
