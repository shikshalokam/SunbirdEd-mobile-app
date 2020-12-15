import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownlaodShareComponent } from './downlaod-share.component';

describe('DownlaodShareComponent', () => {
  let component: DownlaodShareComponent;
  let fixture: ComponentFixture<DownlaodShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownlaodShareComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownlaodShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
