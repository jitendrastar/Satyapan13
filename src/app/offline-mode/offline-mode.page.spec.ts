import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfflineModePage } from './offline-mode.page';

describe('OfflineModePage', () => {
  let component: OfflineModePage;
  let fixture: ComponentFixture<OfflineModePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineModePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineModePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
