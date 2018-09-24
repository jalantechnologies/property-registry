import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractsService} from '@services/contract.service';
import {ViewStateModel} from '@shared/view-state.model';
import CONFIG from '@config';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {PropertyService} from '@services/property.service';

@Component({
  templateUrl: './property-detail.component.html',
  styleUrls: [
    './property-detail.component.css'
  ]
})

export class PropertyDetailComponent implements OnInit {
  propertyAddress: any;
  propertyDetail: any;
  currentOwnerDetail: any;
  tokenContractAddress = CONFIG.contractAddress;
  propertyDetailsViewState = new ViewStateModel();
  ropstenURL = CONFIG.ropstenURL;
  modalRef: NgbModalRef;
  previousOwnerExist = false;
  historyViewState = new ViewStateModel();

  constructor(private route: ActivatedRoute, private contractService: ContractsService, private modalService: NgbModal,
              private propertyService: PropertyService) {}

  ngOnInit() {
    this.propertyAddress = this.route.snapshot.paramMap.get('propertyAddress');
    if (this.propertyAddress) {
      this.getDeedHistory(this.propertyAddress, 1, true);
    }
  }

  openDeedHistoryModal(modalContent, propertyAddress, index) {
    this.modalRef = this.modalService.open(modalContent, {centered: true, size: 'lg'});
    this.getDeedHistory(propertyAddress, index);
  }

  getDeedHistory(propertyAddress, index, currentOwner = false) {
    if (currentOwner) {
      this.propertyDetailsViewState.load();
      this.currentOwnerDetail = {};
    } else  {
      this.propertyDetail = {};
      this.historyViewState.load();
    }
    this.contractService.getPropertyOwnerDetails(this.tokenContractAddress, this.propertyAddress, index).then(response => {
      if (response) {
        const detail = {
          ownerName: response[0],
          ownerEmail: response[1],
          ownerWalletAddress: response[2],
          deedURL: response[3],
          nextIndexExist: response[4],
          previousIndexExist: response[5],
          propertyAddress: propertyAddress,
          index: index
        };
        if (detail.deedURL) {
          this.propertyService.downloadSignedDeed(detail.deedURL).subscribe(res => {
            if (currentOwner) {
              this.previousOwnerExist = !!response[4];
              this.currentOwnerDetail = detail;
              this.propertyDetailsViewState.finishedWithSuccess();
            } else {
              this.propertyDetail = detail;
              this.historyViewState.finishedWithSuccess();
            }
          });
        } else {
          if (currentOwner) {
            this.previousOwnerExist = !!response[4];
            this.currentOwnerDetail = detail;
            this.propertyDetailsViewState.finishedWithSuccess();
          } else {
            this.propertyDetail = detail;
            this.historyViewState.finishedWithSuccess();
          }
        }
      } else {
        this.propertyDetailsViewState.finishedWithError();
      }
    }).catch(err => {
      if (currentOwner) {
        this.propertyDetailsViewState.finishedWithError();
      } else {
        this.historyViewState.finishedWithError();
      }
    });
  }

  openDeedDocument(envelopeId) {
    const URL = `${CONFIG.apiEndpoint}signedDeed/${envelopeId}.pdf`;
    window.open(URL);
  }
}
