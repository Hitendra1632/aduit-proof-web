import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSignComponent } from './document-sign.component';

describe('DocumentSignComponent', () => {
  let component: DocumentSignComponent;
  let fixture: ComponentFixture<DocumentSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
