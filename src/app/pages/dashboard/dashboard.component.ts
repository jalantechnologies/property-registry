import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ContractsService} from '@services/contract.service';
import {Router} from '@angular/router';
import {ViewStateModel} from '@shared/view-state.model';
import CONFIG from '@config';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css'
  ]
})

export class DashboardComponent implements OnInit {
  propertyTokenForm: FormGroup;
  modalRef: NgbModalRef;
  tokenContractAddress = CONFIG.contractAddress;
  metamaskAccount: any;
  propertyDetails: any;
  propertyCreationViewState = new ViewStateModel();

  constructor(private modalService: NgbModal, private contractService: ContractsService, private router: Router) {
    this.propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'));
  }

  ngOnInit() {
    this.contractService.getAccount().then(account => {
      this.metamaskAccount = account;
    });
  }

  setPropertyFormData() {
    this.propertyTokenForm = new FormGroup({
      propertyAddress: new FormControl('', [Validators.required]),
      ownerName: new FormControl('', [Validators.required]),
      ownerEmail: new FormControl('', [Validators.required, Validators.email]),
      ownerWalletAddress: new FormControl('', [Validators.required]),
    });
  }

  createPropertyTokenFormData(content) {
    this.setPropertyFormData();
    this.modalRef = this.modalService.open(content, {centered: true});
  }

  createPropertyToken(formData) {
    this.propertyCreationViewState.load();
    this.contractService.createProperty(this.tokenContractAddress, formData.ownerWalletAddress, formData.propertyAddress,
      formData.ownerName, formData.ownerEmail).then(res => {
      if (res) {
        if (!this.propertyDetails) {
          this.propertyDetails = [];
        }
        this.propertyDetails.push(res);
        localStorage.setItem('propertyDetails', JSON.stringify(this.propertyDetails));
        this.router.navigate(['/property-detail', res.propertyAddress]);
        this.modalRef.close();
        this.propertyCreationViewState.load();
      }
    }).catch(err => {
      this.propertyCreationViewState.finishedWithError();
    });
  }
}
