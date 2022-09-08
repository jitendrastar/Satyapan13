import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignToDealerApplicationListPage } from './assign-to-dealer-application-list.page';

describe('AssignToDealerApplicationListPage', () => {
  let component: AssignToDealerApplicationListPage;
  let fixture: ComponentFixture<AssignToDealerApplicationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignToDealerApplicationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignToDealerApplicationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
