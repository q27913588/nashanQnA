import { Component, OnInit } from '@angular/core';
import { Category } from './model/category';
import { Question } from './model/question';
import { Type } from './model/type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  category: Category[];
  typeList: Type[] = [];
  questionList: Question[] = [];
  panelOpenState: boolean;
  activeCategory: string;
  selectQuestionList: Question[] = [];
  selectQuestionTypeList: Question[] = [];
  selectType = [];
  constructor(
    private http: HttpClient
  ) { }
  title = 'faq';

  ngOnInit(): void {
    // 取類別
    this.getCategory().subscribe((data) => {
      this.category = data;
    });
    // 取資料
    this.getMianData().subscribe((data) => {
      this.questionList = data.data;
      this.selectQuestionList = this.questionList.filter(x => x.category === this.activeCategory);
    });
    this.getTypeList().subscribe((data) => {
      this.typeList = data;
     });
  }

  getCategory(): Observable<any> {
    return this.http.get('assets/category.json');
  }
  getMianData(): Observable<any> {
    return this.http.get('assets/maindata.json');
  }
  getTypeList(): Observable<any> {
    return this.http.get('assets/type.json');
  }
  tabChange(event: number): void{
    this.activeCategory = this.category[event].title;
    if (this.questionList !== undefined){
      this.selectQuestionList = this.questionList.filter(x => x.category === this.activeCategory);
    }
    this.typeList.forEach((value: Type, key: number) => {
      value.check = false;
    });
  }
  checkChange(e: any, i: number): void{
    this.typeList[i].check = e.checked;
    this.initSelectData();
    this.selectQuestionTypeList = [];
    this.selectQuestionList = this.questionList.filter(x => x.category === this.activeCategory);
    let tag = false;
    this.typeList.forEach((value: Type, key: number) => {
      if (value.check === true){
        this.selectQuestionTypeList = this.selectQuestionTypeList.concat(
        this.selectQuestionList.filter(x => x.type === value.title));
        tag = true;
      }}, this);
    this.selectQuestionList = this.selectQuestionTypeList;
    if (tag === false){this.initSelectData(); }
  }
  initSelectData(): void {
    this.selectQuestionList = this.questionList.filter(x => x.category === this.activeCategory);
  }
  panelStatus(isOpen: boolean): string {
    if (!isOpen) {
      return 'assets/img/expand@3x.png';
    } else {
      return 'assets/img/fold@3x.png';
    }
  }

}
