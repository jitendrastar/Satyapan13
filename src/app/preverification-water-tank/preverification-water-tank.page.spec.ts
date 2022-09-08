import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreverificationWaterTankPage } from './preverification-water-tank.page';

describe('PreverificationWaterTankPage', () => {
  let component: PreverificationWaterTankPage;
  let fixture: ComponentFixture<PreverificationWaterTankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreverificationWaterTankPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreverificationWaterTankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
