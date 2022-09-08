import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicListPage } from './lic-list.page';

describe('LicListPage', () => {
  let component: LicListPage;
  let fixture: ComponentFixture<LicListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LicListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
