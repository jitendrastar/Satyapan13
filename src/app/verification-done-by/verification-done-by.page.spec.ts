import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerificationDoneByPage } from './verification-done-by.page';

describe('VerificationDoneByPage', () => {
  let component: VerificationDoneByPage;
  let fixture: ComponentFixture<VerificationDoneByPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationDoneByPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationDoneByPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
