import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicApplicationListPage } from './lic-application-list.page';

describe('LicApplicationListPage', () => {
  let component: LicApplicationListPage;
  let fixture: ComponentFixture<LicApplicationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicApplicationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LicApplicationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
