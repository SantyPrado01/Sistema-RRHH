import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasEditComponent } from './facturas-edit.component';

describe('FacturasEditComponent', () => {
  let component: FacturasEditComponent;
  let fixture: ComponentFixture<FacturasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
