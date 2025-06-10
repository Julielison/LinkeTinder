import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagaCardComponent } from './vaga-card.component';

describe('VagaCardComponent', () => {
  let component: VagaCardComponent;
  let fixture: ComponentFixture<VagaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VagaCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VagaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
