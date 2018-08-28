import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ContractsService} from '@services/contract.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css'
  ]
})

export class DashboardComponent implements OnInit {
  creatingPropertyToken: boolean;
  propertyTokenForm: FormGroup;
  modalRef: NgbModalRef;
  tokenContractAddress = '0x2e44570a4cbfedb5372ea39a907fc814b1692be6';
  createPropertyTokenError: any;
  metamaskAccount: any;

  constructor(private modalService: NgbModal, private contractService: ContractsService) {}

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
    this.creatingPropertyToken = false;
    this.setPropertyFormData();
    this.modalRef = this.modalService.open(content, {centered: true});
  }

  createPropertyToken(formData) {
    this.creatingPropertyToken = true;
    this.contractService.createProperty(this.tokenContractAddress, formData.ownerWalletAddress, formData.propertyAddress,
      formData.ownerName, formData.ownerEmail).then(res => {
      if (res) {
        this.creatingPropertyToken = false;
        this.modalRef.close();
      }
    }).catch(err => {
      this.creatingPropertyToken = false;
      this.createPropertyTokenError = 'You rejected the transaction on Metamask!';
    });
  }
}
