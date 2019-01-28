import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewProjectComponent } from './create-new-project.component';

describe('CreateNewProjectComponent', () => {
  let component: CreateNewProjectComponent;
  let fixture: ComponentFixture<CreateNewProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
