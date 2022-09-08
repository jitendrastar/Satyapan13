import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostSubsidyDetailPage } from './post-subsidy-detail.page';

describe('PostSubsidyDetailPage', () => {
  let component: PostSubsidyDetailPage;
  let fixture: ComponentFixture<PostSubsidyDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSubsidyDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostSubsidyDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
