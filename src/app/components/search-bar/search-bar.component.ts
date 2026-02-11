import { Component, OnInit } from '@angular/core'; //decorator for angular component and lifecycle hook interface
import { CommonModule } from '@angular/common'; //provides common directives like ngIf and ngFor
import { FormControl, ReactiveFormsModule } from '@angular/forms'; //tracks value and validation status of individual input (listensn to changeds in input )
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar', //custom html tag to use this component
  standalone: true, //indicates that this component is self-contained and does not require a module
  imports: [CommonModule, ReactiveFormsModule], //modules that this component depends on
  templateUrl: './search-bar.component.html', //path to html template
//   styleUrls: ['./search-bar.component.css'], //path to css styles
})
export class SearchBarComponent implements OnInit {
  //implements OnInit to use ngOnInit lifecycle hook
  searchControl: FormControl = new FormControl(''); //form control to track input value and status
  results: string[] = []; //array to hold search results

  constructor(private searchService: SearchService) {} //injecting SearchService to use its methods(dependency injection)



  //nested subscription will cause lag in UI
  ngOnInit(): void {//runs after component initialization
    this.searchControl.valueChanges.subscribe((term) => {//runs for each change (every keystroke)
      //subscribing to value changes in the input field
      if (term) {
        //if there is a search term
        this.searchService.getResults(term).subscribe((mockData) => {
          //call getResults from SearchService
          this.results = mockData; //update results array with fetched data
        });
      } else {
        this.results = []; //if input is empty, clear results
      }
    });
  }
}
