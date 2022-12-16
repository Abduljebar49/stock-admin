import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { User } from "firebase/auth";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  message: any;
  //   <div *ngIf="auth.user$ | async as user; else login">
  //   <pre class="text-dark">
  // {{ user | json }}
  // </pre>
  //   <hr />
  //   <button class="button" (click)="auth.signOut()">Sign out</button>
  // </div>
  // <ng-template #login>
  //   <button class="button" (click)="auth.googleSignIn()">
  //     Login with Google
  //   </button>
  // </ng-template>

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    const temp = this.auth.user$;
    console.log("temp : ", temp);
    if (
      this.auth.loggedUserData == null ||
      this.auth.loggedUserData == undefined
    ) {
      console.log("should redirect to login");
    } else {
      console.log("goto dashboard");
    }

    // this.auth.loggedUserData

    const el = document.getElementById("nb-global-spinner");
    if (el) {
      el.style["display"] = "none";
    }
    this.spinner.hide();
  }
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  submit() {
    console.log("data entered : ", this.model);
  }

  fields: FormlyFieldConfig[] = [
    {
      type: "input",
      key: "email",
      templateOptions: {
        tyep: "email",
        label: "Email Address",
        required: true,
      },
    },
    {
      type: "input",
      key: "password",
      templateOptions: {
        tyep: "email",
        label: "Password",
        required: true,
      },
    },
  ];

  async authorizeWithGoogle() {
    this.message = null;
    await this.auth.googleSignIn();
    // console.log("temp : ",tem);
    console.log("loggedUserData : ", this.auth.loggedUserData);
    if (
      this.auth.lengthOfData != null ||
      this.auth.loggedUserData != undefined
    ) {
      console.log("routering to pages");
      this.router.navigate(["pages"]);
    } else {
      console.log("you are not member of this system!");
      this.message = "Sorry you are not member of our site!";
    }
    // if(this.auth.loggedUserData)
  }
}
