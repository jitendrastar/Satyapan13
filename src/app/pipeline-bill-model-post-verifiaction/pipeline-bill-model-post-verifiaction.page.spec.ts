import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PipelineBillModelPostVerifiactionPage } from './pipeline-bill-model-post-verifiaction.page';

describe('PipelineBillModelPostVerifiactionPage', () => {
  let component: PipelineBillModelPostVerifiactionPage;
  let fixture: ComponentFixture<PipelineBillModelPostVerifiactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineBillModelPostVerifiactionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineBillModelPostVerifiactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
