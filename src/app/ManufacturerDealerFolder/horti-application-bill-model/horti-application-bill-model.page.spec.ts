import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HortiApplicationBillModelPage } from './horti-application-bill-model.page';

describe('HortiApplicationBillModelPage', () => {
  let component: HortiApplicationBillModelPage;
  let fixture: ComponentFixture<HortiApplicationBillModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HortiApplicationBillModelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HortiApplicationBillModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
