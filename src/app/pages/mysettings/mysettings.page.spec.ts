import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MysettingsPage } from './mysettings.page';

describe('MysettingsPage', () => {
  let component: MysettingsPage;
  let fixture: ComponentFixture<MysettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MysettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
