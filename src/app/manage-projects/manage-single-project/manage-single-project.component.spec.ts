import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSingleProjectComponent } from './manage-single-project.component';

describe('ManageSingleProjectComponent', () => {
  let component: ManageSingleProjectComponent;
  let fixture: ComponentFixture<ManageSingleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSingleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSingleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
