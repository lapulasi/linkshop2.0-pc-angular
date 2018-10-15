import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
// import {OrgService} from '../../organization/orgService';

import * as $ from 'jquery';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-org-tree',
  templateUrl: './orgTree.html',
  styleUrls: ['./org-tree.component.css']
})

export class OrgTreeComponent implements OnInit, OnChanges {
  @Input() companyId: '129';
  // @Input() staticModal: any;
  @Output() change = new EventEmitter();
  treeData: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // console.log(this.companyId);
    $('.tree').on('click', 'li.parent_li > span', function (e) {

      const children = $(this).parent('li.parent_li').find(' > ul > li');
      if (children.is(':visible')) {

        children.hide('fast');

        $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-folder-o').removeClass('fa-folder-open-o');

      } else {

        children.show('fast');

        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-folder-open-o').removeClass('fa-folder-o');

      }

      e.stopPropagation();

    });
  }

  ngOnChanges() {
    if (this.companyId !== undefined) {
      this.getOrgTree();
    }

  }

  getOrgTree() {
    this.http.get('/org/tree', {params: {companyId: this.companyId}}).subscribe((data: Array<any>) => {
      // console.log('getOrgTree==' + JSON.stringify(data, null, 4));
      if (data.length !== 0) {
        this.treeData = data[0];
      }
    });
  }

  choose(item) {
    this.change.emit(item);
  }
}
