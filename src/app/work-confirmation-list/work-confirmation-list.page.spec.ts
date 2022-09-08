import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkConfirmationListPage } from './work-confirmation-list.page';

describe('WorkConfirmationListPage', () => {
  let component: WorkConfirmationListPage;
  let fixture: ComponentFixture<WorkConfirmationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkConfirmationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkConfirmationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
