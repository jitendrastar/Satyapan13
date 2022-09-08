import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FarmImplementsPostVerificationPage } from './farm-implements-post-verification.page';

describe('FarmImplementsPostVerificationPage', () => {
  let component: FarmImplementsPostVerificationPage;
  let fixture: ComponentFixture<FarmImplementsPostVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmImplementsPostVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmImplementsPostVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
