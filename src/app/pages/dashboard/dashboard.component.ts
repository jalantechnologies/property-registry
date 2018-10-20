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
  USStates = [{'name': 'Alabama', 'value': 'AL'}, {'name': 'Alaska', 'value': 'AK'}, {'name': 'Arizona', 'value': 'AZ'},
    {'name': 'Arkansas', 'value': 'AR'}, {'name': 'California', 'value': 'CA'}, {'name': 'Colorado', 'value': 'CO'},
    {'name': 'Connecticut', 'value': 'CT'}, {'name': 'Delaware', 'value': 'DE'}, {'name': 'District of Columbia', 'value': 'DC'},
    {'name': 'Florida', 'value': 'FL'}, {'name': 'Georgia', 'value': 'GA'}, {'name': 'Hawaii', 'value': 'HI'},
    {'name': 'Idaho', 'value': 'ID'}, {'name': 'Illinois', 'value': 'IL'}, {'name': 'Indiana', 'value': 'IN'},
    {'name': 'Iowa', 'value': 'IA'}, {'name': 'Kansa', 'value': 'KS'}, {'name': 'Kentucky', 'value': 'KY'},
    {'name': 'Lousiana', 'value': 'LA'}, {'name': 'Maine', 'value': 'ME'}, {'name': 'Maryland', 'value': 'MD'},
    {'name': 'Massachusetts', 'value': 'MA'}, {'name': 'Michigan', 'value': 'MI'}, {'name': 'Minnesota', 'value': 'MN'},
    {'name': 'Mississippi', 'value': 'MS'}, {'name': 'Missouri', 'value': 'MO'}, {'name': 'Montana', 'value': 'MT'},
    {'name': 'Nebraska', 'value': 'NE'}, {'name': 'Nevada', 'value': 'NV'}, {'name': 'New Hampshire', 'value': 'NH'},
    {'name': 'New Jersey', 'value': 'NJ'}, {'name': 'New Mexico', 'value': 'NM'}, {'name': 'New York', 'value': 'NY'},
    {'name': 'North Carolina', 'value': 'NC'}, {'name': 'North Dakota', 'value': 'ND'}, {'name': 'Ohio', 'value': 'OH'},
    {'name': 'Oklahoma', 'value': 'OK'}, {'name': 'Oregon', 'value': 'OR'}, {'name': 'Pennsylvania', 'value': 'PA'},
    {'name': 'Rhode Island', 'value': 'RI'}, {'name': 'South Carolina', 'value': 'SC'}, {'name': 'South Dakota', 'value': 'SD'},
    {'name': 'Tennessee', 'value': 'TN'}, {'name': 'Texas', 'value': 'TX'}, {'name': 'Utah', 'value': 'UT'},
    {'name': 'Vermont', 'value': 'VT'}, {'name': 'Virginia', 'value': 'VA'}, {'name': 'Washington', 'value': 'WA'},
    {'name': 'West Virginia', 'value': 'WV'}, {'name': 'Wisconsin', 'value': 'WI'}, {'name': 'Wyoming', 'value': 'WY'}];
  recentlyCreatedProperties: any;
  propertyTokenCreateError = false;

  constructor(private modalService: NgbModal, private contractService: ContractsService, private router: Router,
              private propertyService: PropertyService) {
  }

  ngOnInit() {
    this.contractService.getRecentlyCreatedPropertyAddress1(this.tokenContractAddress).then(res => {
      if (res[0]) {
        this.recentlyCreatedProperties = res;
      }
    });
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
    this.showAddressVerificationScreen = false;
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
    }, error => {
      this.verifyingPropertyAddress.finishedWithError(error);
    });
  }

  cancelAddressVerification() {
    this.propertyTokenCreateError = false;
    this.verifyingPropertyAddress.finishedWithSuccess();
    this.standardisedPropertyAddress = '';
    this.showAddressVerificationScreen = false;
  }

  createPropertyToken(formData) {
    this.propertyTokenCreateError = false;
    this.propertyCreationViewState.load();
    this.contractService.createProperty(this.tokenContractAddress, formData.ownerWalletAddress, this.standardisedPropertyAddress,
      formData.ownerName, formData.ownerEmail).then(res => {
        if (res.success) {
          this.propertyService.storePropertyAddress(res).subscribe(response => {
            this.router.navigate(['/property-detail', response.propertyAddress]);
          });
          this.modalRef.close();
          this.propertyCreationViewState.finishedWithSuccess();
        } else {
          this.propertyCreationViewState.finishedWithError();
          this.propertyTokenCreateError = true;
        }
    }).catch(err => {
      this.propertyCreationViewState.finishedWithError(err);
    });
  }

  searchPropertyAddress(address) {
    address = address ? address : this.searchProperty.value;
    this.router.navigate(['/property-detail', address]);
  }
}
