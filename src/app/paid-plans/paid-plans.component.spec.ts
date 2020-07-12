import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidPlansComponent } from './paid-plans.component';

describe('PaidPlansComponent', () => {
  let component: PaidPlansComponent;
  let fixture: ComponentFixture<PaidPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
