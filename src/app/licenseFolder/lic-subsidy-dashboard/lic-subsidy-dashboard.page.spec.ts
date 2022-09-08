import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicSubsidyDashboardPage } from './lic-subsidy-dashboard.page';

describe('LicSubsidyDashboardPage', () => {
  let component: LicSubsidyDashboardPage;
  let fixture: ComponentFixture<LicSubsidyDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicSubsidyDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LicSubsidyDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
