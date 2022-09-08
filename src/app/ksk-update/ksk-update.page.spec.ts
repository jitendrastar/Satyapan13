import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KskUpdatePage } from './ksk-update.page';

describe('KskUpdatePage', () => {
  let component: KskUpdatePage;
  let fixture: ComponentFixture<KskUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KskUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KskUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
