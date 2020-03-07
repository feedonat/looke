import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MylikesPage } from './mylikes.page';

describe('MylikesPage', () => {
  let component: MylikesPage;
  let fixture: ComponentFixture<MylikesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MylikesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MylikesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
