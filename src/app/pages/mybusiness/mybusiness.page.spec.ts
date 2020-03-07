import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MybusinessPage } from './mybusiness.page';

describe('MybusinessPage', () => {
  let component: MybusinessPage;
  let fixture: ComponentFixture<MybusinessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybusinessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MybusinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
