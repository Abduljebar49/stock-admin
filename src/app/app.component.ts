import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { SeoService } from "./@core/utils/seo.service";

@Component({
  selector: "ngx-app",
  template: `
    <ngx-spinner
      bdColor="rgba(51,51,51,0.8)"
      size="medium"
      color="#fff"
      type="ball-scale-multiple"
    >
      <p style="font-size: 20px; color: white">Loading...</p>
    </ngx-spinner>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  public loggedUserData: any;
  public isSuperAdmin: boolean = false;
  public isStockUser: boolean = false;
  constructor(
    public auth: AuthService,
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    // if(!this.isSuperAdmin){
    // }
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }

  public static setLoggedUserData(data: any) {
    this.setLoggedUserData = data;
  }

  public static getLoggedUserData() {
    return this.setLoggedUserData;
  }
}
