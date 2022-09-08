import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillModelFarmImplementPage } from './bill-model-farm-implement.page';

describe('BillModelFarmImplementPage', () => {
  let component: BillModelFarmImplementPage;
  let fixture: ComponentFixture<BillModelFarmImplementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillModelFarmImplementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillModelFarmImplementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
