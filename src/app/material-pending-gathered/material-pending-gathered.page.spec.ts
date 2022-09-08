import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialPendingGatheredPage } from './material-pending-gathered.page';

describe('MaterialPendingGatheredPage', () => {
  let component: MaterialPendingGatheredPage;
  let fixture: ComponentFixture<MaterialPendingGatheredPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPendingGatheredPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialPendingGatheredPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
