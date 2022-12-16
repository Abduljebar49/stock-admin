import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as firebaseSt from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
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
  }

  async getAccountDetail(id:string): Promise<string> {
    // var branch = await this.getDefaultBranch();
    var url = `account/${id}`;
    return url;
  }

}
