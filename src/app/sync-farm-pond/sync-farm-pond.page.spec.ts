import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SyncFarmPondPage } from './sync-farm-pond.page';

describe('SyncFarmPondPage', () => {
  let component: SyncFarmPondPage;
  let fixture: ComponentFixture<SyncFarmPondPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncFarmPondPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SyncFarmPondPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
