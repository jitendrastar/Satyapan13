import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApplicantListPage } from './applicant-list.page';

describe('ApplicantListPage', () => {
  let component: ApplicantListPage;
  let fixture: ComponentFixture<ApplicantListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
