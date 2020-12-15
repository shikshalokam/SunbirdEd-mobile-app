import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-projects-report',
  templateUrl: './projects-report.component.html',
  styleUrls: ['./projects-report.component.scss'],
})
export class ProjectsReportComponent implements OnInit {
  @Input() type;
  @Input() chartData;
  @Input() mappedSchool;
  constructor() { }

  ngOnInit() {
    this.type = this.type == 'lastmonth' ? 'Last Month' : 'Last Quarter';
  }
  viewFullReport() {}
  getReport(type){}
}