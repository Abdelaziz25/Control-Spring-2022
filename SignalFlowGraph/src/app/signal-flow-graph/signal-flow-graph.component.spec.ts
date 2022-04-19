import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignalFlowGraphComponent} from './signal-flow-graph.component';

describe('SignalFlowGraphDiagramComponent', () => {
  let component: SignalFlowGraphComponent;
  let fixture: ComponentFixture<SignalFlowGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignalFlowGraphComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalFlowGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
