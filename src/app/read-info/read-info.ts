import { Component, ViewChild } from '@angular/core';
import { NavParams, LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { TabsPage } from '../tabs/tabs'
import { Router } from '@angular/router';


@Component({
  selector: 'page-read-info',
  templateUrl: 'read-info.html',
})
export class ReadInfoPage {

  public students: any[];
  isLoggedIn: boolean = false;
  isDelayed: boolean = false;
  public installments: any[];
  username: string = '';
  password: string = '';
  participant_id: string;
  isLoaded: boolean = false;
  value: string = '';
  isIos: boolean = false;
  isConnected: boolean = true;

  public studyInstructions: any;
  public registrationIntroduction: any;

  constructor(public loadingCtrl: LoadingController, private alertCtrl: AlertController, public toastCtrl: ToastController, private http: HttpClient, public router: Router, public navParams: NavParams,
    private storage: Storage, public platform: Platform) {

    storage.get('isLoggedIn').then((val) => {
      console.log('val is', val);

      setTimeout(() => {
        this.storage.get('isConnected').then((val) => {
          if (val) {
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }
        });
      }, 1000);

      if (val == 'true') {
        this.isLoggedIn = true;

        this.storage.get('username').then((val) => {
          this.username = val;
        });

        this.storage.get('password').then((val) => {
          this.password = val;
        });

        this.storage.get('participant_id').then((val) => {
          this.participant_id = val;
        });

        setInterval(() => {
          this.storage.get('selected').then((val) => {
            if (val != '' && val != null) {
              this.value = val;
            }
          });

          this.refreshInfo();
        }, 1000);

      } else {
        this.isLoggedIn = false;
      }
    });

    if (this.platform.is('ios')) {
      this.isIos = true;
    } else if (this.platform.is('android')) {
      this.isIos = false;
    }
  }

  ngOnInit() {
    this.getRegistrationInformation();

  }



  ionViewWillLeave() {
    this.storage.set('num', 6);
  }

  refreshInfo() {
    this.storage.get('installs').then((val) => {
      if (val != null && val != '') {
        this.setInstallments(this.value);
      } else {
        this.storage.get('st_data').then((val) => {
          if (val != null && val != '') {
            this.setInstallments(val[0].installment);
          }
        });
      }
    });
  }

  setInstallments(value) {
    if (value != '') {
      for (var j = 0; j < value.installment.length; j++) {
        if (value.installment[j].status == 'غير مدفوع') {
          this.isDelayed = true;
          break;
        } else {
          this.isDelayed = false;
        }
      }
    }
  }

  goToInstallments(username, password, participant_id) {
    if (this.isConnected) {
      this.storage.get('selected').then((val) => {
        if (val != null && val != '') {
          this.router.navigate(['installments', {
            student: val
          }]);
        } else {
          this.storage.get('st_data').then((val) => {
            if (val != null) {
              this.router.navigate(['installments', {
                student: val[0]
              }]);
            }
          });
        }
      });
    } else {
      this.storage.get('selected').then((val) => {
        this.router.navigate(['installments', {
          student: val
        }]);
      });
    }
  }

  goBack() {
    this.router.navigate(['tabs', {
      status: 'signedIn'
    }]);
  }

  submit() {
    this.router.navigate(['tabs']);
  }

  async getRegistrationInformation() {
    let loading = await this.loadingCtrl.create({
      message: 'يرجى الانتظار'
    });

    loading.present();

    let link = `http://alawaail.com/_mobile_data/api/registration_information.php`;
    this.http.get(link)
      .subscribe(data => {
        loading.dismiss();
        this.studyInstructions = data[0].registration_information[0].study_instructions;
        this.studyInstructions = this.studyInstructions.replace(/(?:\r\n|\r|\n)/g, '<br />');

        this.registrationIntroduction = data[0].registration_information[1].registration_introduction;
      }, err => {
        alert(err);
      });
  }
}
