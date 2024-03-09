import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJsonFormComponent } from './ngx-json-form.component';

describe('NgxJsonFormComponent', () => {
  let component: NgxJsonFormComponent;
  let fixture: ComponentFixture<NgxJsonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxJsonFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxJsonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
