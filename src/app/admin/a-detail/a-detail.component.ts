import { AdminService } from "./../admin.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { Account } from "../../models/account";
import { AuthService } from "../../services/auth.service";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { NbDialogService } from "@nebular/theme";
import Swal from "sweetalert2";

@Component({
  selector: "ngx-a-detail",
  templateUrl: "./a-detail.component.html",
  styleUrls: ["./a-detail.component.scss"],
})
export class ADetailComponent implements OnInit {
  id: any;
  data = {
    createdAt: "",
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    name: "",
    objId: "",
    phone: "",
    role: "",
    uid: "",
    subscription: "",
    photoURL:
      "data:image/jpeg;base64,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",
  };
  constructor(
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    private router: Router,
    private modalService: NgbModal,
    private adminService: AdminService,
    private dialogService: NbDialogService
  ) {
    this.spinner.show();
    this.id = this.activatedRoute.snapshot.queryParamMap.get("id");
  }

  async ngOnInit(): Promise<void> {
    const el = document.getElementById("nb-global-spinner");
    if (el) {
      el.style["display"] = "none";
    }

    var url = await this.adminService.getAccountDetail(this.id);
    this.db
      .object(url)
      .valueChanges()
      .subscribe((data: any) => {
        try {
          this.data.email = data.email;
          this.data.objId = data.objId;
          this.data.uid = data.uid;
          this.data.role = data.role;
          this.data.name = data.name;
          this.data.createdAt = data.createdAt;
          this.data.phone = data.phone;
          this.data.gender = data.gender;
          this.data.displayName = data.displayName;
          this.data.subscription = data.subscriptionStatus;
          this.data.firstName = data.firstName;
          this.data.lastName = data.lastName;
          this.spinner.hide();
        } catch (er) {
          this.spinner.hide();
        }
      });
  }

  async onSubmit(data: any) {
    if (this.form.valid) {
      this.spinner.show();
      console.log("form data : ", this.model);
      const id = this.db.createPushId();

      var emailString = "" + this.model.email;
      emailString = emailString.toLowerCase();

      this.db.object("account/" + this.id + "/").update({
        name: this.model.name,
        displayName: this.model.firstName + " " + this.model.lastName,
        firstName: this.model.firstName,
        subscriptionStatus: this.model.subscription,
        lastName: this.model.lastName,
        gender: this.model.gender,
        phone: this.model.phone,
      });

      Swal.fire("updated", "Shop successfully updated", "success");

      this.spinner.hide();
    } else {
      Swal.fire(
        "Error",
        "There was problem updating the shop information",
        "error"
      );
      this.spinner.hide();
    }
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  open(content) {
    this.fields = [
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            className: "col-6",
            type: "input",
            key: "firstName",
            defaultValue: this.data.firstName,
            templateOptions: {
              label: "First Name",
              required: true,
            },
          },
          {
            className: "col-6",
            key: "lastName",
            type: "input",
            defaultValue: this.data.lastName,
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
            defaultValue: this.data.gender,
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
            defaultValue: this.data.phone,
            templateOptions: {
              label: "Phone Number",
              required: true,
            },
          },
        ],
      },
      // {
      //   fieldGroupClassName: "row",
      //   fieldGroup: [
      //     {
      //       className: "col-12",
      //       type: "input",
      //       key: "email",
      //       defaultValue: this.data.email,
      //       templateOptions: {
      //         label: "Email",
      //         required: true,
      //         type: "email",
      //       },
      //     },
      //   ],
      // },
      {
        fieldGroupClassName: "row",
        fieldGroup: [
          {
            type: "input",
            key: "name",
            className: "col-6",
            defaultValue: this.data.name,
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
            defaultValue: this.data.subscription,
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
    ];

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

  openWithoutBackdropClick(dialog: TemplateRef<any>) {
    if (dialog != null) {
      this.dialogService.open(dialog);
    } else {
      console.log("dialog is null");
    }
  }

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

  form = new FormGroup({});
  model = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    name:"",
    gender: "",
    operation: "",
    type: "",
    subscription: "",
    defaultBranch: "",
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
      ],
    },
  ];
}
