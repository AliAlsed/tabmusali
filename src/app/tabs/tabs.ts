import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.scss'],
})
export class TabsPage {



  constructor() {
    // navParams.get('status');
  }
}
