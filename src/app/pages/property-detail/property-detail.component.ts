import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContractsService} from '@services/contract.service';

@Component({
  templateUrl: './property-detail.component.html',
  styleUrls: [
    './property-detail.component.css'
  ]
})

export class PropertyDetailComponent implements OnInit {
  propertyAddress: any;
  propertyDetail: any;
  tokenContractAddress = '0x2e44570a4cbfedb5372ea39a907fc814b1692be6';
  propertyDetailError: any;
  loadingDeedHistory = false;

  constructor(private route: ActivatedRoute, private contractService: ContractsService) {}

  ngOnInit() {
    this.propertyAddress = this.route.snapshot.paramMap.get('propertyAddress');
    if (this.propertyAddress) {
      this.getDeedHistory(this.propertyAddress, 1);
    }
  }

  getDeedHistory(propertyAddress, index) {
    this.propertyDetail = {};
    this.loadingDeedHistory = true;
    this.contractService.getPropertyOwnerDetails(this.tokenContractAddress, this.propertyAddress, index).then(response => {
      this.propertyDetail = {
        ownerName: response[0],
        ownerEmail: response[1],
        ownerWalletAddress: response[2],
        deedURL: response[3],
        nextIndexExist: response[4],
        previousIndexExist: response[5],
        propertyAddress: propertyAddress,
        index: index
      };
      this.loadingDeedHistory = false;
    }).catch(err => {
      this.loadingDeedHistory = false;
      this.propertyDetailError = true;
      this.loadingDeedHistory = false;
    });
  }
}
