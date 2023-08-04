import {Injectable} from '@angular/core';
import {ClientsService} from "../../../../../../clients.service";
import {IResponse} from "../../../../shared";
import {ConstantsMapper} from "./constraints";

interface ConvertedData {
  [key: string]: {
    id: string;
    affiliates: {
      [key: string]: {
        id: string;
        departments: {
          [key: string]: {
            id: string;
            services: {
              [key: string]: {
                id: string
              };
            };
          };
        }
        positions: {
          [key: string]: {
            id: string
          };
        };
      };
    };
    managers: {
      [key: string]: {
        id: string;
      };
    };
    jobTypes: {
      [key: string]: {
        id: string;
      };
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  currentCompany: any;
  currentCompanyMapper: ConvertedData = {};
  constantsMapper  = ConstantsMapper;

  constructor(private clientsService: ClientsService) {
  }

  initMapper(data) {
    const companyName = data.name;
    this.currentCompanyMapper[companyName] = {
      id: data.id.toString(),
      affiliates: {},
      managers: {},
      jobTypes: {}
    };
    for (const affiliate of data.affiliates) {
      const affiliateName = affiliate.name;
      this.currentCompanyMapper[companyName].affiliates[affiliateName] = {
        id: affiliate.id.toString(),
        departments: {},
        positions: {}
      };
      for (const position of affiliate.positions){
        const positionName = position.name;
        this.currentCompanyMapper[companyName].affiliates[affiliateName].positions[positionName] = {
          id: position.id.toString()
        }
      }

      for (const department of affiliate.departments) {
        const departmentName = department.name;
        this.currentCompanyMapper[companyName].affiliates[affiliateName].departments[departmentName] = {
          id: department.id.toString(),
          services: department.services
        };
        for (const service of department.services) {
          const serviceName = service.name;
          this.currentCompanyMapper[companyName].affiliates[affiliateName].departments[departmentName].services[serviceName] = {
            id: service.id.toString(),
          }
        }
      }
    }
    for (const manager of data.managers) {
      const managerName = manager.name;
      this.currentCompanyMapper[companyName].managers[managerName] = {
        id: manager.id.toString()
      }
    }
    for (const jobType of data.jobTypes) {
      const jobTypeName = jobType.name;
      this.currentCompanyMapper[companyName].jobTypes[jobTypeName] = {
        id: jobType.id.toString()
      }
    }
  }

  applyMapper(data, item) {
  }

  uploadEmployees(data) {
    for (let row of data) {
      row.EmpGender = this.constantsMapper[row.EmpGender];
      row.EmpMaritalStatus = this.constantsMapper[row.EmpMaritalStatus];
      row.EmpSalaryFrequency = this.constantsMapper[row.EmpSalaryFrequency];
      row.UserGroup = row.UserGroup === '' ?null : this.constantsMapper[row.UserGroup];
      row.EmpCategory = row.EmpCategory === '' ? null : this.constantsMapper[row.EmpCategory];
      row.EmpService = row.EmpService === '' ? null : this.currentCompanyMapper[this.currentCompany.name].affiliates[row.EmpLocation].departments[row.EmpDepartment].services[row.EmpService].id;
      row.EmpDepartment = row.EmpDepartment === '' ? null : this.currentCompanyMapper[this.currentCompany.name].affiliates[row.EmpLocation].departments[row.EmpDepartment].id;
      row.EmpPosition = row.EmpPosition === '' ? null : this.currentCompanyMapper[this.currentCompany.name].affiliates[row.EmpLocation].positions[row.EmpPosition].id;
      row.EmpLocation = row.EmpLocation === '' ? null : this.currentCompanyMapper[this.currentCompany.name].affiliates[row.EmpLocation].id;
      // row.EmpCompany = this.currentMapper[this.currentCompany.name].id;
      row.DirectManagerName = row.DirectManagerName === '' ? null : this.currentCompanyMapper[this.currentCompany.name].managers[row.DirectManagerName].id;
      row.PositionLevel = row.PositionLevel === '' ? null : this.currentCompanyMapper[this.currentCompany.name].jobTypes[row.PositionLevel].id;
    }
    console.log(data);
  }

  setCompanyHierarchy(id) {
    this.clientsService.getCompanyHierarchy(id).subscribe((res: IResponse) => {
      this.currentCompany = res.data;
      this.initMapper(res.data);
      console.log(this.currentCompany)
      console.log(this.currentCompanyMapper)
    });
  }

  getListOfAffiliates() {
    return this.currentCompany.affiliates;
  }

  checkIfAffiliateExists(affiliateName) {
    return this.currentCompany.affiliates.some((affiliate) => affiliate.name === affiliateName);
  }

  checkIfDepartmentExists(departmentName, AffiliateName) {
    const affiliate = this.currentCompany.affiliates.find((affiliate) => affiliate.name === AffiliateName);
    return affiliate ? affiliate.departments.some((department) => department.name === departmentName) : false;
  }

  checkIfPositionExists(positionName, AffiliateName) {
    const affiliate = this.currentCompany.affiliates.find((affiliate) => affiliate.name === AffiliateName);
    return affiliate ? affiliate.positions.some((position) => position.name === positionName) : false;
  }

  checkIfServiceExists(serviceName, departmentName, AffiliateName) {
    if (serviceName === '') return true;
    const affiliate = this.currentCompany.affiliates.find((affiliate) => affiliate.name === AffiliateName);
    const department = affiliate ? affiliate.departments.find((department) => department.name === departmentName) : false;
    return department ? department.services.some((service) => service.name === serviceName) : false;
  }
  checkIfManagerExists(managerName) {
    return this.currentCompany.managers.some((manager) => manager.name === managerName);
  }
  checkIfJobTypeExists(jobTypeName) {
    if (jobTypeName === '') return true;
    return this.currentCompany.jobTypes.some((jobType) => jobType.name === jobTypeName);
  }

}
