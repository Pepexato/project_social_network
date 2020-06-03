import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("Inciar el componente main de mensajes");
  }

}
