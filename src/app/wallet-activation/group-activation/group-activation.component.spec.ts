import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupActivationComponent } from './group-activation.component';

describe('GroupActivationComponent', () => {
  let component: GroupActivationComponent;
  let fixture: ComponentFixture<GroupActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
