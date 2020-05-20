import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SingleInvestItemComponent } from './single-invest-item/single-invest-item.component';


import { MyPortfolioComponent } from './my-portfolio.component';

describe('MyPortfolioComponent', () => {
  let component: MyPortfolioComponent;
  let fixture: ComponentFixture<MyPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyPortfolioComponent,
        SingleInvestItemComponent
      ],
      imports: [ RouterTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
