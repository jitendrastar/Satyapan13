import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignmodalPage } from './assignmodal.page';

describe('AssignmodalPage', () => {
  let component: AssignmodalPage;
  let fixture: ComponentFixture<AssignmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
