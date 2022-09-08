import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialCompletedListPage } from './material-completed-list.page';

describe('MaterialCompletedListPage', () => {
  let component: MaterialCompletedListPage;
  let fixture: ComponentFixture<MaterialCompletedListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCompletedListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCompletedListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
