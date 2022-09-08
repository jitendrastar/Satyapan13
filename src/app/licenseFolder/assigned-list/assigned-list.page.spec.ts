import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignedListPage } from './assigned-list.page';

describe('AssignedListPage', () => {
  let component: AssignedListPage;
  let fixture: ComponentFixture<AssignedListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignedListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
