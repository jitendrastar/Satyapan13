import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AaoVerificationPage } from './aao-verification.page';

describe('AaoVerificationPage', () => {
  let component: AaoVerificationPage;
  let fixture: ComponentFixture<AaoVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AaoVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AaoVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
