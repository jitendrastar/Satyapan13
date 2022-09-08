import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FarmImplimentPreVerificationPage } from './farm-impliment-pre-verification.page';

describe('FarmImplimentPreVerificationPage', () => {
  let component: FarmImplimentPreVerificationPage;
  let fixture: ComponentFixture<FarmImplimentPreVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmImplimentPreVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmImplimentPreVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
