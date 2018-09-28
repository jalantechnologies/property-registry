import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ContractsService} from '@services/contract.service';
import {Router} from '@angular/router';
import {ViewStateModel} from '@shared/view-state.model';
import CONFIG from '@config';
import {PropertyService} from '@services/property.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class DashboardComponent implements OnInit {
  propertyTokenForm: FormGroup;
  modalRef: NgbModalRef;
  tokenContractAddress = CONFIG.contractAddress;
  propertyCreationViewState = new ViewStateModel();
  propertyAddresses = [];
  searchProperty: FormControl = new FormControl();
  showAddressVerificationScreen = false;
  standardisedPropertyAddress: String;
  verifyingPropertyAddress = new ViewStateModel();

  constructor(private modalService: NgbModal, private contractService: ContractsService, private router: Router,
              private propertyService: PropertyService) {
  }

  ngOnInit() {
    this.searchProperty.valueChanges.subscribe(
      propertyAddress => {
        if (propertyAddress !== '') {
          this.propertyService.getPropertyAddress(propertyAddress).subscribe(
            data => {
              this.propertyAddresses = data as any[];
            });
        }
      });
  }

  setPropertyFormData(ownerWalletAddress) {
    this.propertyTokenForm = new FormGroup({
      street1: new FormControl('', [Validators.required]),
      street2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      ownerName: new FormControl('', [Validators.required]),
      ownerEmail: new FormControl('', [Validators.required, Validators.email]),
      ownerWalletAddress: new FormControl(ownerWalletAddress ? ownerWalletAddress : '', [Validators.required]),
    });
  }

  createPropertyTokenFormData(content) {
    this.contractService.getAccount().then(account => {
      this.setPropertyFormData(account);
      this.modalRef = this.modalService.open(content, {centered: true});
    }, err => {
      alert(err.message);
    });
  }

  verifyAddress(formData) {
    this.verifyingPropertyAddress.load();
    this.showAddressVerificationScreen = true;
    const propertyAddress = {
      'street1': formData.street1 ? formData.street1 : '',
      'street2': formData.street2 ? formData.street2 : '',
      'city': formData.city ? formData.city : '',
      'state': formData.state ? formData.state : '',
      'zipCode': formData.zipCode ? formData.zipCode : ''
    };
    this.propertyService.verifyAddress(propertyAddress).subscribe(response => {
      this.standardisedPropertyAddress = response;
      this.verifyingPropertyAddress.finishedWithSuccess();
    });
  }

  createPropertyToken(formData) {
    this.propertyCreationViewState.load();
    this.contractService.createProperty(this.tokenContractAddress, formData.ownerWalletAddress, this.standardisedPropertyAddress,
      formData.ownerName, formData.ownerEmail).then(res => {
        this.propertyService.storePropertyAddress(res).subscribe(response => {
          this.router.navigate(['/property-detail', response.propertyAddress]);
        });
        this.modalRef.close();
        this.propertyCreationViewState.finishedWithSuccess();
    }).catch(err => {
      this.propertyCreationViewState.finishedWithError(err);
    });
  }

  searchPropertyAddress(address) {
    address = address ? address : this.searchProperty.value;
    this.router.navigate(['/property-detail', address]);
  }
}
