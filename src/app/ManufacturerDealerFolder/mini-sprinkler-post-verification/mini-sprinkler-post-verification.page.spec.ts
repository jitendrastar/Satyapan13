import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MiniSprinklerPostVerificationPage } from './mini-sprinkler-post-verification.page';

describe('MiniSprinklerPostVerificationPage', () => {
  let component: MiniSprinklerPostVerificationPage;
  let fixture: ComponentFixture<MiniSprinklerPostVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniSprinklerPostVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MiniSprinklerPostVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
