import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialPendingGatheredDetailsPage } from './material-pending-gathered-details.page';

describe('MaterialPendingGatheredDetailsPage', () => {
  let component: MaterialPendingGatheredDetailsPage;
  let fixture: ComponentFixture<MaterialPendingGatheredDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPendingGatheredDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialPendingGatheredDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
