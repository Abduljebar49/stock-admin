import { Router } from '@angular/router';
import { Branch } from "./../../../models/branch";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "./../../../services/auth.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  subscriptionStatus = "";
  user: any;
  id: any;
  branches: Branch[] = [];
  selectedBranch:any;
  shopName:any;
  daysLeft:number = 0;
  // themes = [
  //   {
  //     value: "default",
  //     name: "Light",
  //   },
  //   {
  //     value: "dark",
  //     name: "Dark",
  //   },
  //   {
  //     value: "cosmic",
  //     name: "Cosmic",
  //   },
  //   {
  //     value: "corporate",
  //     name: "Corporate",
  //   },
  // ];

  currentTheme = "Main";

  userMenu = [{ title: "Profile" ,action:"clickedmenu()"}, { title: "Log out",action:"clickedmenu1()" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private db: AngularFireDatabase,
    private router:Router,
  ) {}

  clickedmenu(){
    console.log("click1")
  }

  clickedmenu1(){
    console.log("click2")
  }

 async userMenuEvent($event){
    console.log("event : ",$event);
    if($event == "Profile"){
      this.router.navigateByUrl(`pages/admin/detail?id=${this.auth.loggedUserData.uid}`);
    }
    if($event == "Log out"){
      localStorage.removeItem('stock-management-branch');
      localStorage.removeItem('stock-management-info');
      this.router.navigateByUrl('/login');
    }
  }


  async ngOnInit() {
    this.spinner.show();
    this.id = this.auth.loggedUserData.objId;
    this.user = this.auth.loggedUserData;
    this.branches = [];
    // this.branches =  await this.auth.getBranchList();
    await (
      await this.auth.getBranchList()
    ).forEach((data) => {
      var itExist = false;
      this.branches.forEach((ele) => {
        if (ele.name == data.name) {
          itExist = true;
        }
      });
      if (!itExist) {
        this.branches.push(data);
      }
    });

    var userData:string;

    if(this.auth.defaultBranch== null || this.auth.defaultBranch == undefined){
      userData = localStorage.getItem('stock-management-branch');
      if(userData==null || userData == undefined){
        this.selectedBranch = await this.auth.getDefaultBranch();
        console.log("this.shopName : ",this.shopName);
      }else{
        this.auth.changeDefaultBranch(userData);
        this.selectedBranch = userData;
      }
    }else{
      this.selectedBranch = this.auth.defaultBranch;      
    }
    // console.log("shopName : ",await this.auth.getShopName())
    this.shopName = await this.auth.getShopName();
    this.spinner.hide();
    // await this.auth.setDefaultDatas();
    // let data = this.db.object(
      this.menuService.onItemClick().subscribe(( event ) => {
        this.userMenuEvent(event.item.title);
      })

      this.subscriptionStatus = this.auth.getSubscriptionStatus();
      var date1 = new Date(this.auth.loggedUserData.createdAt);
      var date2 = new Date(this.auth.today.toDateString());
        
      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();
        
      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      console.log("subscrption stat >>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ");
      this.daysLeft = 30-Difference_In_Days;
      if(this.daysLeft<=0)
      {
        localStorage.removeItem('stock-management-branch');
        localStorage.removeItem('stock-management-info');  
        this.router.navigateByUrl('trial');
      }
    // )
    // this.currentTheme = this.themeService.currentTheme;
    // this.userService
    //   .getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => (this.user = users.nick));
    // const { xl } = this.breakpointService.getBreakpointsMap();
    // this.themeService
    //   .onMediaQueryChange()
    //   .pipe(
    //     map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(
    //     (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
    //   );
    // this.themeService
    //   .onThemeChange()
    //   .pipe(
    //     map(({ name }) => name),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeBranch($event) {
    console.log("selected branch : ", $event);
    this.auth.changeDefaultBranch($event);
    this.selectedBranch = $event;
    location.reload();
  }

  // changeTheme(themeName: string) {
  //   this.themeService.changeTheme(themeName);
  // }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
