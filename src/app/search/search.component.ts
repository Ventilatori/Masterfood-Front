import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  @Input() tags: string[] = [];
  @Input() allTags: Set<string> = new Set()

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  @Output() onNameChanged = new EventEmitter<string>()
  @Output() onTagsChanged = new EventEmitter<string[]>()

  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : Array.from(this.allTags.values()))),
    );
  }

  ngOnInit(): void {
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) 
      this.tags.push(value);

    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
    this.onTagsChanged.emit(this.tags)
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0)
      this.tags.splice(index, 1);

    this.onTagsChanged.emit(this.tags)
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.onTagsChanged.emit(this.tags)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return [...this.allTags].filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
