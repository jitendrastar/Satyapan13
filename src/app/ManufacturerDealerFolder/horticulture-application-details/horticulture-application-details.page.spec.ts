import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorticultureApplicationDetailsPage } from './horticulture-application-details.page';

describe('HorticultureApplicationDetailsPage', () => {
  let component: HorticultureApplicationDetailsPage;
  let fixture: ComponentFixture<HorticultureApplicationDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorticultureApplicationDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorticultureApplicationDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
