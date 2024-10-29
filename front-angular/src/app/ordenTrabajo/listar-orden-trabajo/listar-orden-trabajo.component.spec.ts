import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarOrdenTrabajoComponent } from './listar-orden-trabajo.component';

describe('ListarOrdenTrabajoComponent', () => {
  let component: ListarOrdenTrabajoComponent;
  let fixture: ComponentFixture<ListarOrdenTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarOrdenTrabajoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarOrdenTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
