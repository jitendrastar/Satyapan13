import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialVerificationListPage } from './material-verification-list.page';

describe('MaterialVerificationListPage', () => {
  let component: MaterialVerificationListPage;
  let fixture: ComponentFixture<MaterialVerificationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialVerificationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialVerificationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
