import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MicroSprinklerPostVerificationPage } from './micro-sprinkler-post-verification.page';

describe('MicroSprinklerPostVerificationPage', () => {
  let component: MicroSprinklerPostVerificationPage;
  let fixture: ComponentFixture<MicroSprinklerPostVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroSprinklerPostVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroSprinklerPostVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
