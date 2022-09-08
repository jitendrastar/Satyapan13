import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApplicationVerificationCompletedPage } from './application-verification-completed.page';

describe('ApplicationVerificationCompletedPage', () => {
  let component: ApplicationVerificationCompletedPage;
  let fixture: ComponentFixture<ApplicationVerificationCompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationVerificationCompletedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationVerificationCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
