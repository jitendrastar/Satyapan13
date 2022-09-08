import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiggiPreVerificationPage } from './diggi-pre-verification.page';

describe('DiggiPreVerificationPage', () => {
  let component: DiggiPreVerificationPage;
  let fixture: ComponentFixture<DiggiPreVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiggiPreVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiggiPreVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
