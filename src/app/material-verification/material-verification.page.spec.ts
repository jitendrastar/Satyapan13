import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialVerificationPage } from './material-verification.page';

describe('MaterialVerificationPage', () => {
  let component: MaterialVerificationPage;
  let fixture: ComponentFixture<MaterialVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
