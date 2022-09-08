import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VersionUpdatePage } from './version-update.page';

describe('VersionUpdatePage', () => {
  let component: VersionUpdatePage;
  let fixture: ComponentFixture<VersionUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VersionUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
