import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() tags: string[] = [];
  @Input() allTags: Set<string> = new Set()

  @Output() onNameChanged = new EventEmitter<string>()
  @Output() onTagsChanged = new EventEmitter<string[]>()

  constructor() { }

  ngOnInit(): void { }

}
