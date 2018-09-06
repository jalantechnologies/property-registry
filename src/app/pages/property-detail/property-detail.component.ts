import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractsService} from '@services/contract.service';
import {ViewStateModel} from '@shared/view-state.model';
import CONFIG from '@config';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private route: ActivatedRoute, private contractService: ContractsService, private modalService: NgbModal) {}

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
      if (currentOwner) {
        this.previousOwnerExist = !!response[4];
        this.currentOwnerDetail = detail;
        this.propertyDetailsViewState.finishedWithSuccess();
      } else {
        this.propertyDetail = detail;
        this.historyViewState.finishedWithSuccess();
      }
    }).catch(err => {
      if (currentOwner) {
        this.propertyDetailsViewState.finishedWithError('You are trying to access invalid property address');
      } else {
        this.historyViewState.finishedWithError('You are trying to access invalid property address');
      }
    });
  }
}
