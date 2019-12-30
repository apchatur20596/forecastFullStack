import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressBar.component.html',
  styleUrls: ['./progressBar.component.css'],
})

export class ProgressBarComponent {
  @Input() response = '';
  constructor() {
    console.log(this.response);
   }
}
