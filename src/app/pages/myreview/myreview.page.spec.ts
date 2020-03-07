import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyreviewPage } from './myreview.page';

describe('MyreviewPage', () => {
  let component: MyreviewPage;
  let fixture: ComponentFixture<MyreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
