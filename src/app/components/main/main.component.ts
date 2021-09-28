import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';

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
    this.loadData();
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

    this.getIpAddress();
  }

  getIpAddress(){
    this.http.get("http://api.ipify.org/?format=json").subscribe((data:any)=>{
      this.client.ipAddress = data.ip;
      this.client.browser = window.navigator.userAgent;
      this.client.onlineStatus = true;
      this.client.osVersion = '';
      this.client.resolution = '';
      this.client.timeZone = '';
      console.log(this.client);

      var from = new Date();
      var date = moment(from).format('Z'); //ZZ

      alert(date);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.loadData();
  }

}
