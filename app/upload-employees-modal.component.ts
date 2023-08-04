import {Component, OnInit, SimpleChanges} from '@angular/core';
import {ConstraintMethods, FileColumns, getCurrentConstraints, getRelationalConstraints} from "./constraints";
import { ColumnMode } from '@swimlane/ngx-datatable';
import {AddEmployeesInputs} from "../../form-inputs";
import {Router} from "@angular/router";
import {ClientsService} from "../../../../../../clients.service";
import {MyModalService} from "../../../../../../my-modal.service";
import {forkJoin, Subscription} from "rxjs";
import {UploadService} from "./upload.service";
import {CompanyHierarchyComponent} from "./company-hierarchy/company-hierarchy.component";
@Component({
  selector: 'app-upload-employees-modal',
  templateUrl: './upload-employees-modal.component.html',
  styleUrls: ['./upload-employees-modal.component.scss']
})
export class UploadEmployeesModalComponent implements OnInit {
  selectedRows : boolean[] = [];
  isAllChecked = false;
  errors = [];
  temp ;
  activeCell: string |null;
  checked : boolean = false;
  closeResult: string;
  fileColumns  = FileColumns
  checkButtonClass = "btn btn-avidia"
  selectedFile = null;
  selectedFileId = 0;
  data  = [];
  constraints ;
  jsonData = [];
  headers = AddEmployeesInputs.map( (i) => i.name);
  submittedUploadReady : boolean = false;
  companyId = this.router.url.split('/')[2];

  constructor(private router : Router ,
              private clientsService : ClientsService ,
              private myModalService : MyModalService,
              private uploadService : UploadService,
              ) {}
  ngOnInit(): void {
    this.uploadService.setCompanyHierarchy(this.companyId);
  }


  removeFile() {
    this.errors = [];
    this.checked = false;
    this.checkButtonClass = "btn btn-avidia"
    this.selectedFile = null;
    this.data = [];
    this.rows = []
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.value = null;
  }
  handleFileInput(event) {
    this.rows = [];
    this.data = [];
    this.errors = [];
    this.checked = false;
    this.checkButtonClass = "btn btn-avidia"

    this.selectedFile = event.target.files[0];
    this.selectedFileId += 1;
    const reader = new FileReader();
    reader.readAsText(this.selectedFile);

    reader.onload = () => {
      const csvData = reader.result as string;
      const rows = csvData.split('\n');

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        const obj = {};
        const tmp = [];
        for (let j = 0; j < rows[0].split(',').length; j++) {
          obj[this.fileColumns[j+1].prop] = row[j];
          tmp.push(row[j])
        }
        this.data.push(tmp);
        this.rows.push(obj);

        this.selectedRows.push(true);

      }
      this.resetErrorsTable();
      this.rows = [...this.rows];
    };
  }
  resetErrorsTable() {
    this.errorsTable = Array.from({ length: this.rows.length }, () => ({}));
  }
  resetData(){
    this.data = [];
  }

  editing  = null;
  rows = [];
  ColumnMode = ColumnMode;
  errorsTable  = [];
  private emailCheckSubscription: Subscription;
  updateValue(event, cell, rowIndex) {
    this.editing = null;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.data = []
    for (let i = 0; i < this.rows.length; i++) {
      const tmp = [];
      for (let j = 1; j < this.fileColumns.length; j++) {
        tmp.push(this.rows[i][this.fileColumns[j].prop])
      }
      this.data.push(tmp);
    }
  }

  applyConstraint(constraint: string, data: any, args?: any) {
    const method = ConstraintMethods[constraint];
    if (method) {
      if (args) {
        return method(data, args);
      } else {
        return method(data);
      }
    } else {
      throw new Error(`Unsupported constraint: ${constraint}`);
    }
  }
  singleCellCheck(){
    let valid = true;
    let message;
    for (let i = 0; i < this.data.length; i++) {
      if (this.selectedRows[i] == false) continue;
      for (let j = 0; j < this.data[i].length; j++) {
        this.data[i][j] = this.data[i][j].trim();
        for (let constraint of this.constraints[j]) {
          if (this.applyConstraint(constraint.constraint, this.data[i][j] , constraint.args) == false) {
            message = `error in row ${i} column ${j} constraint ${constraint.constraint}`;
            this.errors.push(message);
            this.errorsTable[i][this.fileColumns[j+1].prop] = true;
            valid = false;
          }
        }
      }
    }
    return valid;
  }
  relationalCellCheck() {
    let valid = true;
    let message;
    // this.logNewCsv(this.data)
    for (let i = 0 ; i < this.data.length ; i++) {
      if (this.selectedRows[i] == false) continue;
      const constraints = getRelationalConstraints(this.data[i],this.uploadService);
      for (let constraint of constraints) {
        if (!constraint.passed) {
          message = `error in row ${i} column(s) ${constraint.columns} constraint ${constraint.message}`;
          this.errors.push(message);
          for (let j = 0; j < constraint.columns.length; j++){
            this.errorsTable[i][this.fileColumns[constraint.columns[j]+1].prop] = true;
          }
          valid = false;
          // console.log(constraint.message)
        }
      }
    }
    return valid;
  }
  logNewCsv(data){
  //convert list to csv
    let csv = '';
    for (let i = 0; i < data.length; i++) {
      csv += data[i].join(',') + '\n';
    }
    console.log(csv)
  }
  uniqueEmailCheck(){
    let valid = true;
    let message;
    const emailSet = new Set();
    for (let i = 0; i < this.data.length; i++) {
      if (this.selectedRows[i] == false) continue;
      if (emailSet.has(this.data[i][26])) {
        message = `error in row ${i} column ${26} constraint Unique Email`;
        this.errors.push(message);
        this.errorsTable[i][this.fileColumns[27].prop] = true;
        valid = false;
      }
      else {
        emailSet.add(this.data[i][26]);
      }
    }
    return valid;
  }
  async emailExistsInDatabaseCheck(): Promise<boolean> {
    const localFileId = this.selectedFileId
    let valid = true;
    let message;

    for (let i = 0; i < this.data.length; i++) {
      if (this.selectedRows[i] == false) continue;

      try {
        const res = await this.clientsService.getEmployeeByEmail(this.data[i][26]).toPromise();
        if (this.selectedFile != null && localFileId == this.selectedFileId) {
          if (res.exists) {

            message = `error in row ${i} column ${26} constraint Email Exists In Database`;
            this.errors.push(message);
            this.errorsTable[i][this.fileColumns[27].prop] = true;
            valid = false;
          }
        }
      } catch (error) {
        // Handle error if API call fails
        console.error(error);
      }
    }

    return valid;
  }

  async check() {
    this.resetErrorsTable();
    this.errors = [];
    this.constraints = getCurrentConstraints(this.data);
    const singleCellCheck = this.singleCellCheck();
    if (singleCellCheck) {
      const relationalCheck = this.relationalCellCheck();
      const uniqueEmailCheck = this.uniqueEmailCheck();
      if (uniqueEmailCheck && relationalCheck) {
        try {
          const emailExistsCheck = await this.emailExistsInDatabaseCheck();
          if (emailExistsCheck) {
            this.checked = true;
          } else {
            this.checkButtonClass = "btn btn-warning";
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        this.checkButtonClass = "btn btn-warning";
      }
    } else {
      this.checkButtonClass = "btn btn-warning";
    }
  }


  submitFile() {
    this.temp = this.data.filter((row, index) => this.selectedRows[index]);
    console.log("headers",this.headers)
    console.log("temp",this.temp)
    this.jsonData = this.convertToJSON(this.temp, this.headers);
    console.log("json data",this.jsonData);
    // return ;
    this.uploadService.uploadEmployees(this.jsonData)
    return;
    const requests = this.jsonData.map(i => this.clientsService.addEmployee(i));

    forkJoin(requests).subscribe((responses) => {
      console.log(responses);
      // Last request is completed, so set submittedUploadReady to true
      this.submittedUploadReady = true;
    });
  }
  convertToJSON(data,header) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const obj = {};
      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = data[i][j];
        if (obj[header[j]] == null) {
          console.log(i,j)}
      }
      obj['CompanyId'] = this.companyId;
      result.push(obj);
    }
    console.log(result)
    return result;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isAllChecked) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = this.isAllChecked;
      });
    }
  }


  updateCheckboxes(event) {
    this.selectedRows = Array(this.data.length).fill(event.target.checked);
    this.checked = false;
    this.checkButtonClass = "btn btn-avidia";
  }
  closeModal(){
    this.myModalService.dismissModal();
  }
  ViewCompanyHierarchy() {
    this.myModalService.openFullScreenModal(CompanyHierarchyComponent);
  }
}
