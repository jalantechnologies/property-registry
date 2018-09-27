import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  ngOnInit() {
  }
  
  constructor(private modalService: NgbModal) {
  }
  
  launchEnterpriseInfoModal(content) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }
}
