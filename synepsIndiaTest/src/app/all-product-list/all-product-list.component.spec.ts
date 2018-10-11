import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProductListComponent } from './all-product-list.component';

describe('AllProductListComponent', () => {
  let component: AllProductListComponent;
  let fixture: ComponentFixture<AllProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
