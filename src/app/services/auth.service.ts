import { NgxSpinnerService } from "ngx-spinner";
import { first, switchMap, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../models/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { authInstanceFactory } from "@angular/fire/auth/auth.module";
import { Auth } from "@angular/fire/auth";
import firebase from "firebase/compat/app";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Account } from "../models/account";
import { Branch } from "../models/branch";
import * as firebaseSt from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<User>;
  loggedUserData: Account;
  lengthOfData: number;
  defaultBranch: string;
  branches: Branch[] = [];
  role: string;
  shopName: string;
  private isInitializedSource = new BehaviorSubject<any>(false);
  isInitialized = this.isInitializedSource.asObservable();
  today: Date;
  dailyReportPath: string;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService
  ) {
    const tStamp = firebaseSt.Timestamp;

    this.today = new Date(
      tStamp.now()["seconds"] * 1000 + tStamp.now()["nanoseconds"] / 1000000
    );
    this.dailyReportPath =
      this.today.getFullYear() +
      "_" +
      (this.today.getMonth() + 1) +
      "_" +
      this.today.getDate() +
      "/";

    // this.user$ = this.afAuth.authState.pipe(
    //   switchMap((user) => {
    //     if (user) {
    //       return this.db.object('emailList').valueChanges();
    //       // return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
  }

  getDailyReportPath() {
    return this.dailyReportPath;
  }

  async googleSignIn() {
    const credential = this.afAuth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
    return this.updateUserData((await credential).user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(["/login"]);
  }

  changeInitializationStatus(int: any) {
    this.isInitializedSource.next(int);
  }

  private async updateUserData({ uid, email, displayName, photoURL }: User) {
    this.spinner.show();
    const length = this.db
      .list("account", (ref) => ref.orderByChild("email").equalTo(email))
      .snapshotChanges()
      // .pipe(first())
      .pipe(take(1))
      .toPromise();

    const acc: Account = {
      uid,
      email,
      displayName,
      photoURL,
      objId: "",
      suqCode: "testSHOP",
      createdAt: "",
    };

    const temp = (await length).length;

    if (temp > 0) {
      (await length).forEach((doc) => { });
      // localStorage.setItem(
      //   'agenagn-web-userAB21',
      //   JSON.stringify(doc.data())
      // );
      const dat = this.db
        .object("account/" + acc.uid)
        .valueChanges()
        // .pipe(first())
        .pipe(take(1))

        .toPromise();
      acc.objId = (await dat)["objId"];
      console.log("llllllllllllllllllll", (await dat)["objId"]);
      this.loggedUserData = acc;

      console.log("user actual data : ", (await dat)["role"]);
      this.shopName = (await dat)["name"];

      this.loggedUserData.createdAt = (await dat)["createdAt"];
      this.loggedUserData.subscription = (await dat)["subscriptionStatus"];
      // console.log("createdAt : ",this.loggedUserData.createdAt);
      // console.log("createdAt : ",(await dat)['subscriptionStatus']);
      localStorage.setItem("stock-management-shopInfo", this.shopName);

      if ((await dat)["role"] != "Owner") {
        this.branches = (await dat)["branches"];
      }

      localStorage.setItem("stock-management-info", JSON.stringify(acc));
      this.spinner.hide();
      console.log("acc : ", acc);

      return await dat;
      // this.db.object(`account/${acc.objId}`).update({
      //   displayName: acc.displayName,
      //   photoURL: acc.photoURL,
      //   email: acc.email,
      //   // uid: acc.uid,
      //   // objId: acc.objId,
      // });

      // return userRef.set(data, { merge: true });
      // return
    } else {
      this.spinner.hide();
      return "You are not part of this system";
    }

    // const userRef = this.db.object(`emailList/${}`)
    // AngularFirestoreDocument<User> = this.afs.doc(
    //   `users/${uid}`
    // );
    const tool = false;
  }

  updateLoggedUserData(data) {
    this.loggedUserData = data;
  }

  async getDefaultBranch() {
    if (this.defaultBranch == null || this.defaultBranch == undefined) {
      await this.setDefaultDatas();
    }
    console.log("getting default branch : ", this.defaultBranch);
    return this.defaultBranch;
  }

  async getDefaultBranchId() {
    const branchName = await this.getDefaultBranch();
    var id = 1;
    const length = this.db
      .list("AccountSetting/" + this.loggedUserData.objId + "/branches")
      .valueChanges()
      // .pipe(first())
      .pipe(take(1))
      .toPromise();

    (await length).forEach(data => {
      console.log("data : ", data);
      if (branchName == data['name']) {
        id = data['type'];
      }
    })

    console.log("we found id ; ", id);
    return id;
  }

  async getBranchList() {
    if (
      this.branches == null ||
      this.branches == undefined ||
      this.branches.length == 0
    ) {
      await this.setDefaultDatas();
    }

    return this.branches;
  }

  async getExistingBranch() {
    var branchTemp: Branch[] = [];
    const branchList = this.db
      .list("AccountSetting/" + this.loggedUserData.objId + "/branches")
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    (await branchList).forEach((element: Branch) => {
      branchTemp.push(element);
    });

    return branchTemp;
  }

  async getUserRole() {
    if (this.role == null || this.role == undefined) {
      await this.setDefaultDatas();
    }

    return this.role;
  }

  async changeDefaultBranch(branchName: string) {
    localStorage.setItem("stock-management-branch", branchName);
    this.defaultBranch = branchName;
  }

  async setDefaultDatas() {
    const dat = this.db
      .object("account/" + this.loggedUserData.uid)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    this.role = (await dat)["role"];

    if (this.role == "Owner") {
      const branchList = this.db
        .list("AccountSetting/" + this.loggedUserData.objId + "/branches")
        .valueChanges()
        .pipe(take(1))
        .toPromise();

      (await branchList).forEach((data: Branch) => {
        var itExist = false;
        this.branches.forEach((ele) => {
          if (ele.name == data.name) {
            itExist = true;
          }
        });
        if (!itExist) {
          this.branches.push(data);
        }

        // this.branches.push(element);
      });
      // this.defaultBranch = this.branches[0].name;
      var userBranch = localStorage.getItem("stock-management-branch");
      console.log("userBranch : ", userBranch);

      if (userBranch == null || userBranch == undefined) {
        this.defaultBranch = this.branches[0].name;
      } else {
        this.defaultBranch = userBranch;
      }
    } else {
      (await dat)["branches"].forEach((data) => {
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
      var userBranch = localStorage.getItem("stock-management-branch");
      console.log("userBranch : ", userBranch);
      if (userBranch == null || userBranch == undefined) {
        this.defaultBranch = this.branches[0].name;
      } else {
        this.defaultBranch = userBranch;
      }
      console.log("branches of user : ", this.branches);
    }
    console.log("role : ", this.role);
    console.log("branch : ", this.defaultBranch);
    console.log("branches : ", this.branches);
  }

  async getRegisterIsDuplicateUrl(): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}/${branch}`;

    return url;
  }

  async getRegisterLinkUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}/${branch}/${id}`;

    return url;
  }

  async getReturnSearchUrl(): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}`;

    return url;
  }

  async getReturnProductUrl(pToSearch: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pToSearch}/return/${id}`;

    return url;
  }

  async getReturnProductSaleUpdateUrl(
    pToSearch: string,
    id: string
  ): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pToSearch}/sale/${id}`;

    return url;
  }

  async getReturnProductListUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}/return`;
    return url;
  }

  async getReturnProductDetailUrl(pid: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pid}/return/${id}`;
    return url;
  }

  async getMoveProductListUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}/move`;
    return url;
  }

  async getMoveProductDetailUrl(pid: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pid}/move/${id}`;
    return url;
  }
  async getMoveFromProductDetailUrl(pid: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pid}/moveFrom/${id}`;
    return url;
  }


  async getSaleSearchUrl(): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}/${branch}`;
    return url;
  }

  async getSaleProductUrl(pToSearch: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pToSearch}/sale/${id}`;
    return url;
  }

  async getSaleWithCreditProductUrl(pToSearch: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pToSearch}/saleCredit/${id}`;
    return url;
  }

  // "productData/" +
  // this.auth.loggedUserData.objId +
  // "Report/" +
  // +this.auth.getDefaultBranch() +
  // "/" +
  // this.selectedProduct.id

  async getSaleProductCheckUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}`;
    return url;
  }

  async getSaleWithCreditProductCheckUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}ReportCredit/${branch}/${id}`;
    return url;
  }

  async getSaleProductCheckAnotherUrl(id: string, branch: string): Promise<string> {
    // var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}`;
    return url;
  }

  async getSaleProductSaleUpdateUrl(
    pToSearch: string,
    id: string
  ): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pToSearch}/sale/${id}`;

    return url;
  }

  async getSaleProductSoldBefore(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}`;

    return url;
  }

  async getSaleWithCreditProductSoldBefore(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}ReportCredit/${branch}/${id}`;
    return url;
  }



  async getSaleProductSoldBeforeAnother(id: string, branch: string): Promise<string> {
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}`;
    return url;
  }

  async getSaleProductListUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}/sale`;
    return url;
  }

  async getSaleProductDetailUrl(pid: string, id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${pid}/sale/${id}`;
    return url;
  }

  async getSoldProductDailyReport(
    dailyPath: string,
    id: string
  ): Promise<string> {
    var url = `productData/${this.loggedUserData.objId}ReportDaily/${dailyPath}/${id}`;
    return url;
  }

  async getTodayReport(dailyPath: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}ReportDaily/${dailyPath}`;
    return url;
  }
  //getProductListBranchUrl
  async getProductListUrl(): Promise<string> {
    var branch = await this.getDefaultBranch();
    console.log("loggeduserdata : ", this.loggedUserData);
    var url = `productData/${this.loggedUserData.objId}/${branch}`;
    return url;
  }

  async getProductListBranchUrl(branch: string): Promise<string> {
    // var branch = await this.getDefaultBranch();
    console.log("loggeduserdata : ", this.loggedUserData);
    var url = `productData/${this.loggedUserData.objId}/${branch}`;
    return url;
  }

  async getProductDetailUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}/${branch}/${id}`;
    return url;
  }

  async getProductReportDetailUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}`;
    return url;
  }

  async getShopName() {
    const name = localStorage.getItem("stock-management-shopInfo");
    console.log("shop Name ; ", name);
    return name;
  }

  async getMoveProductUrl(branch: string, id: string) {
    var url = `productData/${this.loggedUserData.objId}/${branch}/${id}`;
    return url;
  }

  async getMoveLinkUrl(id: string, branch: string): Promise<string> {
    var url = `productData/${this.loggedUserData.objId}/${branch}/${id}`;
    return url;
  }

  async getMoveLinkMoveUrl(id: string, tempId: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}/move/${tempId}`;
    return url;
  }

  async getMoveLinkMoveToAnotherUrl(id: string, tempId: string, branch): Promise<string> {
    var url = `productData/${this.loggedUserData.objId}Report/${branch}/${id}/moveFrom/${tempId}`;
    return url;
  }

  async getSaleProductReductLink(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}/${branch}/${id}`;
    return url;
  }

  async getDailyReportUrlPath(): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}ReportDaily/`;
    return url;
  }

  async getOperationalHistoryAddUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Operational/${branch}/${id}`;
    return url;
  }
  async getOperationalHistoryListUrl(): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}Operational/${branch}`;
    return url;
  }

  async getDeleteProductUrl(id: string): Promise<string> {
    var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}/${branch}/${id}`;
    return url;
  }

  async getSaleWithCreditReportUrl(branch:string): Promise<string> {
    // var branch = await this.getDefaultBranch();
    var url = `productData/${this.loggedUserData.objId}ReportCredit/${branch}`;
    return url;
  }

  getSubscriptionStatus() {
    return this.loggedUserData.subscription;
  }
}
