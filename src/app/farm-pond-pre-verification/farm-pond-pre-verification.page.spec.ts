import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FarmPondPreVerificationPage } from './farm-pond-pre-verification.page';

describe('FarmPondPreVerificationPage', () => {
  let component: FarmPondPreVerificationPage;
  let fixture: ComponentFixture<FarmPondPreVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmPondPreVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmPondPreVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
