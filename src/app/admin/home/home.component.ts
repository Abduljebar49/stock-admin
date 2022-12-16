import { NgxSpinnerService } from "ngx-spinner";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "./../../services/auth.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { UserList } from "../../models/user-list";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { getAuth } from "firebase/auth";
import * as firebase from "firebase/firestore";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { BranchList } from "../../models/branchList";

@Component({
  selector: "ngx-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  userlist: UserList[] = [];
  items: Observable<any[]>;
  closeResult = "";
  databaseUrl: string = "account/";
  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {
    this.items = db
      .list(this.databaseUrl, (ref) =>
        ref.orderByChild("role").equalTo("Owner")
      )
      .valueChanges();
  }
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  preventDuplicates = false;
  today: Date;
  config: NbToastrConfig;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;

  shopType: any[] = [
    {
      name: "Free Trial",
      id: 4,
    },
    {
      name: "Basic",
      id: 1,
    },
    {
      name: "Limited",
      id: 2,
    },
    {
      name: "Premium",
      id: 3,
    },
  ];

  ngOnInit(): void {
    const tStamp = firebase.Timestamp;
    const el = document.getElementById("nb-global-spinner");
    if (el) {
      el.style["display"] = "none";
    }

    this.today = new Date(
      tStamp.now()["seconds"] * 1000 + tStamp.now()["nanoseconds"] / 1000000
    );
  }

  form = new FormGroup({});
  model = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    operation: "",
    type: "",
    subscription: "",
    defaultBranch: "",
    branchType:1,
  };

  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: "row",
      fieldGroup: [
        {
          className: "col-6",
          type: "input",
          key: "firstName",
          defaultValue: "",
          templateOptions: {
            label: "First Name",
            required: true,
          },
        },
        {
          className: "col-6",
          key: "lastName",
          type: "input",
          defaultValue: "",
          templateOptions: {
            label: "last Name",
            required: true,
            // type
          },
        },
      ],
    },
    {
      fieldGroupClassName: "row",
      fieldGroup: [
        {
          className: "col-6",
          type: "select",
          key: "gender",
          defaultValue: "",
          templateOptions: {
            label: "Gender",
            options: [
              {
                label: "Male",
                value: "Male",
              },
              {
                label: "Female",
                value: "Female",
              },
            ],
            required: true,
          },
        },
        {
          className: "col-6",
          type: "input",
          key: "phone",
          defaultValue: "",
          templateOptions: {
            label: "Phone Number",
            required: true,
          },
        },
      ],
    },
    {
      fieldGroupClassName: "row",
      fieldGroup: [
        {
          className: "col-12",
          type: "input",
          key: "email",
          defaultValue: "",
          templateOptions: {
            label: "Email",
            required: true,
            type: "email",
          },
        },
      ],
    },
    {
      fieldGroupClassName: "row",
      fieldGroup: [
        {
          type: "input",
          key: "type",
          className: "col-6",
          templateOptions: {
            type: "text",
            label: "Shop Name",
            required: true,
          },
        },
        {
          type: "select",
          key: "subscription",
          className: "col-6",
          templateOptions: {
            label: "Subscription status",
            options: this.shopType,
            valueProp: "name",
            labelProp: "name",
            required: true,
          },
        },
      ],
    },
    {
      fieldGroupClassName: "row",
      fieldGroup: [
        {
          type: "input",
          key: "defaultBranch",
          className: "col-6",
          templateOptions: {
            type: "text",
            label: "Default branch Name",
            required: true,
          },
        },
        {
          className: "col-6",
          type: "select",
          key: "branchType",
          templateOptions: {
            label: "Enter branch type",
            options: BranchList.shopType,
            valueProp: "id",
            labelProp: "name",
            required: true,
          },
        },

      ],
    },
  ];

  async onSubmit(data: any) {
    if (this.form.valid) {
      this.spinner.show();
      console.log("form data : ", this.model);
      const id = this.db.createPushId();
      var length;
      try {
        length = await this.afAuth.createUserWithEmailAndPassword(
          this.model.email,
          id
        );
      } catch (error) {
        Swal.fire(
          "Email already registered!",
          "Email already registered as employee",
          "error"
        );
        this.spinner.hide();
        if (this.modalService.hasOpenModals()) {
          this.modalService.dismissAll();
        }
        return;
      }
      // console.log("lognth : ", length);

      var userData = {
        name: this.model.type,
        objId: length.user.uid,
        displayName: this.model.firstName + " " + this.model.lastName,
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        gender: this.model.gender,
        email: this.model.email,
        subscriptionStatus: this.model.subscription,
        uid: length.user.uid,
        role: "Owner",
        hireDate: this.today,
        phone: this.model.phone,
      };
      // console.log("userData : ", userData);
      var emailString = "" + this.model.email;
      emailString = emailString.toLowerCase();
      this.db.object(this.databaseUrl + length.user.uid + "/").set({
        name: this.model.type,
        objId: length.user.uid,
        displayName: this.model.firstName+" " + this.model.lastName,
        gender: this.model.gender,
        email: emailString,
        uid: length.user.uid,
        role: "Owner",
        hireDate: this.today,
        phone: this.model.phone,
        createdAt: this.today.toDateString().toString(),
      });
      var branches = {
        Main: {
          nameShow: this.model.defaultBranch,
          name: this.model.defaultBranch,
          type: this.model.branchType,
        },
      };
      this.db
        .object("AccountSetting/" + length.user.uid + "/")
        .set({ branches });
      Swal.fire("Registered", "Shop successfully registered", "success");
      // this.showToast(this.types[0], "Success", "User successfully created.");
      this.spinner.hide();
    } else {
      Swal.fire("Error", "There was problem saving the shop", "error");
      this.spinner.hide();

      // this.showToast(
      //   this.types[0],
      //   "Fill all fields",
      //   "All fields should be filled"
      // );
    }
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  openUserDetail(user: UserList) {
    console.log("item selected ", user);
    this.router.navigateByUrl("/admin/detail?id=" + user.uid);
  }

  openWithoutBackdropClick(dialog: TemplateRef<any>) {
    if (dialog != null) {
      this.dialogService.open(dialog);
    } else {
      console.log("dialog is null");
    }
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `. ${title}` : "";

    this.index += 1;
    this.toastrService.show(body, ``, config);
  }

  types: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  open(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false,
      centered: true,
    };
    this.modalService.open(content, ngbModalOptions);
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
