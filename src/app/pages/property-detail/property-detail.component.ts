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

  constructor(private route: ActivatedRoute, private contractService: ContractsService) {}

  ngOnInit() {
    this.propertyAddress = this.route.snapshot.paramMap.get('propertyAddress');
    if (this.propertyAddress) {
      this.contractService.getPropertyOwnerDetails(this.tokenContractAddress, this.propertyAddress, 1).then(response => {
        this.propertyDetail = {
          ownerName: response[0],
          ownerEmail: response[1],
          ownerWalletAddress: response[2]
        };
      }).catch(err => {
        this.propertyDetailError = true;
      });
    }
  }
}
