import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {




  constructor(public platform: Platform) {}


  titleLayout = 'hide';
  position = 'center';
  fabVisible = true;
  icon = 'checkmark';

  customTitleLayoutOptions: any = {
    header: 'Title Layout',
    subHeader: 'Select a title layout'
  };

  customFabPositionOptions: any = {
    header: 'Fab Position',
    subHeader: 'Select a floating action button position.'
  };

  ngOnInit() {
  }

}
