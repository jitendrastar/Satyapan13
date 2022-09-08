import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostVerificationShowDetailsConfirmationPage } from './post-verification-show-details-confirmation.page';

describe('PostVerificationShowDetailsConfirmationPage', () => {
  let component: PostVerificationShowDetailsConfirmationPage;
  let fixture: ComponentFixture<PostVerificationShowDetailsConfirmationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostVerificationShowDetailsConfirmationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostVerificationShowDetailsConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
