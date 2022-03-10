import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignalFlowDiagramComponent} from './signal-flow-diagram.component';

describe('ProducerConsumerDiagramComponent', () => {
  let component: SignalFlowDiagramComponent;
  let fixture: ComponentFixture<SignalFlowDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignalFlowDiagramComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalFlowDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
