import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveOrganizationsComponent } from './approve-organizations.component';

describe('ApproveOrganizationsComponent', () => {
  let component: ApproveOrganizationsComponent;
  let fixture: ComponentFixture<ApproveOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveOrganizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
