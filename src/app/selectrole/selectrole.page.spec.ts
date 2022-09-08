import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectrolePage } from './selectrole.page';

describe('SelectrolePage', () => {
  let component: SelectrolePage;
  let fixture: ComponentFixture<SelectrolePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectrolePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectrolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
