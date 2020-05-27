import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineuserComponent } from './timelineuser.component';

describe('TimelineuserComponent', () => {
  let component: TimelineuserComponent;
  let fixture: ComponentFixture<TimelineuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
