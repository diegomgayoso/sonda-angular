import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknotesComponent } from './sicknotes.component';

describe('SicknotesComponent', () => {
  let component: SicknotesComponent;
  let fixture: ComponentFixture<SicknotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SicknotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SicknotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
