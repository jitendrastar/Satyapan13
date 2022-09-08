import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectBrandNamePage } from './select-brand-name.page';

describe('SelectBrandNamePage', () => {
  let component: SelectBrandNamePage;
  let fixture: ComponentFixture<SelectBrandNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBrandNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectBrandNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
