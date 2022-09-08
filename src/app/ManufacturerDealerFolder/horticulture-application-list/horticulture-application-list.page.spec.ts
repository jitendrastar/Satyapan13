import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorticultureApplicationListPage } from './horticulture-application-list.page';

describe('HorticultureApplicationListPage', () => {
  let component: HorticultureApplicationListPage;
  let fixture: ComponentFixture<HorticultureApplicationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorticultureApplicationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorticultureApplicationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
