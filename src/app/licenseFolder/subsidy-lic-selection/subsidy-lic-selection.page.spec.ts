import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubsidyLicSelectionPage } from './subsidy-lic-selection.page';

describe('SubsidyLicSelectionPage', () => {
  let component: SubsidyLicSelectionPage;
  let fixture: ComponentFixture<SubsidyLicSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidyLicSelectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubsidyLicSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
