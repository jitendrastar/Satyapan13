import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicDashboardPage } from './lic-dashboard.page';

describe('LicDashboardPage', () => {
  let component: LicDashboardPage;
  let fixture: ComponentFixture<LicDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LicDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
