import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PvCompletePage } from './pv-complete.page';

describe('PvCompletePage', () => {
  let component: PvCompletePage;
  let fixture: ComponentFixture<PvCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PvCompletePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PvCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
