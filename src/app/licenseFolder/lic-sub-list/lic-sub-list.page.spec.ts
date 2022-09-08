import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicSubListPage } from './lic-sub-list.page';

describe('LicSubListPage', () => {
  let component: LicSubListPage;
  let fixture: ComponentFixture<LicSubListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicSubListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LicSubListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
