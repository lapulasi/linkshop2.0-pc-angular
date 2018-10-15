import {Component, Input} from '@angular/core';
import {navItems} from './../../_nav';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public companyList: any = [];
  companyId = 0;
  company: any;

  constructor(private httpClient: HttpClient) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

    /* const user = JSON.parse(localStorage.getItem('currentUser'));
     this.companyId = user.companyId;*/
    // console.log(this.companyId);
    this.getCompanyList();
  }

  getCompanyList() {
    this.httpClient.get<any>('/org/company/' + this.companyId).subscribe(data => {
      // console.log(JSON.stringify(data, null, 4));
      this.companyList = data.content;
    });
  }

  onCompanyChange(event) {
    if (event) {
      this.companyId = this.companyList[event].id;
      localStorage.setItem('select_companyId', JSON.stringify(this.companyId));
    } else {
      return;
    }
  }
}
