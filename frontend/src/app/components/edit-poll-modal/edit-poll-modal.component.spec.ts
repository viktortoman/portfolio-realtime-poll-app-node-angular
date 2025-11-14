import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPollModalComponent } from './edit-poll-modal.component';

describe('EditPollModalComponent', () => {
  let component: EditPollModalComponent;
  let fixture: ComponentFixture<EditPollModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPollModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPollModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
