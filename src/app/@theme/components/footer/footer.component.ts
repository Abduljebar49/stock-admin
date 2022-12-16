import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created by <b><a href="https://www.dabbalsoftwares.com" target="_blank">Dabbal Softwares</a></b> {{year}}
    </span>
    <div class="socials">
      <a href="https://dabbalsoftwares.com/#footer" target="_blank" class="ion ion-social-github"></a>
      <a href="https://dabbalsoftwares.com/#footer" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://dabbalsoftwares.com/#footer" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://dabbalsoftwares.com/#footer" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
  year:string = '';
  constructor(private auth:AuthService){
    this.year = auth.today.getFullYear().toString();
  }
}
