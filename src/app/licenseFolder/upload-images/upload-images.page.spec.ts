import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadImagesPage } from './upload-images.page';

describe('UploadImagesPage', () => {
  let component: UploadImagesPage;
  let fixture: ComponentFixture<UploadImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
