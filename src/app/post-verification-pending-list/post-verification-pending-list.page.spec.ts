import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostVerificationPendingListPage } from './post-verification-pending-list.page';

describe('PostVerificationPendingListPage', () => {
  let component: PostVerificationPendingListPage;
  let fixture: ComponentFixture<PostVerificationPendingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostVerificationPendingListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostVerificationPendingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
