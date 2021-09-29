import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public clientService: ClientService) { }

  ngOnInit(): void {
    this.getIpAddress();
  }

  client: Client = new Client();
  clients: Client[] = [];

  loadData() {
    this.clientService.getList().subscribe((data:any) => {
      if(data.wasSuccess){
        this.clients = data.responseObject;
      }
      else{
        console.error(data.errorText);
      }
    }, error => {
      console.error(error);
    });
  }

  getIpAddress(){
    this.http.get("http://api.ipify.org/?format=json").subscribe((data:any)=>{
      this.client.ipAddress = data.ip;
      // this.client.browser = window.navigator.userAgent;
      this.client.browser = this.getBrowser();
      this.client.onlineStatus = true;
      // this.client.osVersion = window.navigator.appVersion;
      this.client.resolution = this.getScreenSize();
      this.client.timeZone = moment(new Date()).format('Z');
      this.clientService.post(this.client, '').subscribe(data => {
        console.log('Success: Data saved.');
        this.loadData();
      });
    });
  }

  getLocalTime(){
    var localDate = new Date();
    return moment(localDate).format('hh:mm a');
  }

  // Browser size
  getScreenSize() {
    return window.innerWidth + ' X ' + window.innerHeight;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.client.onlineStatus = false;
    this.clientService.put(this.client, '').subscribe();
  }

  getBrowser() { 
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return 'Opera';
    }else if(navigator.userAgent.indexOf("Chrome") != -1 ){
        return 'Chrome';
    }else if(navigator.userAgent.indexOf("Safari") != -1){
        return 'Safari';
    }else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
         return 'Firefox';
    }else if((navigator.userAgent.indexOf("MSIE") != -1 )){
      return 'IE'; 
    }
     else {
       return 'unknown';
    }
  }

}
