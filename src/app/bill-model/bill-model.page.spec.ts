import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillModelPage } from './bill-model.page';

describe('BillModelPage', () => {
  let component: BillModelPage;
  let fixture: ComponentFixture<BillModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillModelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
