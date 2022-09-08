import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostverificationReportPage } from './postverification-report.page';

describe('PostverificationReportPage', () => {
  let component: PostverificationReportPage;
  let fixture: ComponentFixture<PostverificationReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostverificationReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostverificationReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
