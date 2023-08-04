import {inputs} from "../../shared";
import {Validators} from "@angular/forms";

export const AddEmployeesInputs: inputs[] = [
  {
    name: 'EmpFirstName',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'First Name',
    validators: [Validators.required],
  }, {
    name: 'EmpMiddleName',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Middle Name',
    validators: [],
  }, {
    name: 'EmpLastName',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Last Name',
    validators: [Validators.required],
  }, {
    name: 'EmpBirthDate',
    icon: 'fa fa-user',
    type: 'date',
    placeholder: 'Birth Date',
    validators: [Validators.required],
  }, {
    name: 'EmpNationalId',
    icon: 'fa fa-user',
    type: 'number',
    placeholder: 'National ID',
    // validators: [Validators.required],
    validators: []
  }, {
    name: 'EmpGender',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Gender',
    validators: [],
    options: [
      {value: "msg_Male", label: "Male"},
      {value: "msg_Female", label: "Female"}
    ],
  }, {
    name: 'EmpMartialStatus',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Marital Status',
    validators: [Validators.required],
    options: [{value: "msg_Single", label: "Single"}, {value: "msg_Married", label: "Married"}],
  }, {
    name: 'EmpAddress1',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Address 1',
    validators: [],
  }, {
    name: 'EmpAddress2',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Address 2',
    validators: [],
  }, {
    name: 'EmpCountry',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Country',
    validators: [Validators.required],
    options: [],
  }, {
    name: 'EmpState',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Country',
    validators: [Validators.required],
    options: []
  }, {
    name: 'EmpCity',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'City',
    validators: [Validators.required],
  }, {
    name: 'EmpPostalCode',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Postal Code',
    validators: [Validators.required],
  }, {
    name: 'EmpMobile',
    icon: 'fa fa-user',
    type: 'number',
    placeholder: 'Mobile',
    validators: [Validators.required],
  },
  // {
  //   name: 'EmpEmployeeId',
  //   icon: 'fa fa-user',
  //   type: 'number',
  //   placeholder: 'Employee ID',
  //   validators: [],
  // },
  // {
  //   name: 'EmpCode',
  //   icon: 'fa fa-user',
  //   type: 'number',
  //   placeholder: 'Employee Code',
  //   validators: [],
  // },
  {
    name: 'EmpJobTitle',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Job Title',
    validators: [Validators.required],
  }, {
    name: 'EmpLocation',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Location',
    validators: [Validators.required],
    options: []
  }, {
    name: 'EmpPosition',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Position',
    validators: [Validators.required],
    options: []
  }, {
    name: 'EmpPositionLevel',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Position Level',
    validators: [],
    options: [
      { value: "", label: "" },
      { value: "1", label: "FullTime" },
      { value: "2", label: "PartTime" },
      { value: "3", label: "FullTimeTemp" },
      { value: "4", label: "PartTimeTemp" },
      { value: "5", label: "Intern" },
      { value: "6", label: "Trainee" },
      { value: "7", label: "Consultant" },
      { value: "8", label: "Volunteer" },]
  }, {
    name: 'EmpDepartment',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Department*',
    validators: [Validators.required],
    options: []
  }, {
    name: 'EmpService',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Service',
    validators: [],
    options: []
  }, {
    name: 'EmpCategory',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Category',
    validators: [],
    options: []

  }, {
    name: 'EmpBaseSalary',
    icon: 'fa fa-user',
    type: 'number',
    placeholder: 'Base Salary',
    validators: [Validators.required],
  }, {
    name: 'EmpSalaryFrequency',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'Salary Frequency',
    validators: [],
    options: [{value: "1", label : "Hourly"},{value: "2", label: "Weekly"}, {value: "3", label: "Monthly"}, {value: "4", label: "Yearly"}],
  }, {
    name: 'EmpDirectManagerName',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Direct Manager Name',
    // validators: [Validators.required],
    validators: [],
  }, {
    name: 'EmpHireDate',
    icon: 'fa fa-user',
    type: 'date',
    placeholder: 'Hire Date',
    validators: [Validators.required],
  }, {
    name: 'EmpBeginDate',
    icon: 'fa fa-user',
    type: 'date',
    placeholder: 'Begin Date',
    validators: [Validators.required],
  }, {
    name: 'EmpEmail',
    icon: 'fa fa-user',
    type: 'text',
    placeholder: 'Email',
    validators: [Validators.required],
  }, {
    name: 'UserGroup',
    icon: 'fa fa-user',
    type: 'select',
    placeholder: 'User Group',
    validators: [],
    options: [
      { value: "Employee Group", label: "Employee Group" },
      { value: "Management Group", label: "Management Group" },
      { value: "Executive Group", label: "Executive Group" },
      { value: "HR Group", label: "HR Manager Group" },
      { value: "HR Assistant", label: "HR Assistant Group" }
    ]
  }];
