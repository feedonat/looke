import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  constructor(private storage: Storage, private router: Router) { }

  ngOnInit() {
  }


  next() {
    this.slides.slideNext();
  }

  async finish() {
    await this.storage.set('tutorialSeen', true);
    this.router.navigateByUrl('/login');
  }
}
