import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForwardToPage } from './forward-to.page';

describe('ForwardToPage', () => {
  let component: ForwardToPage;
  let fixture: ComponentFixture<ForwardToPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardToPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForwardToPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
