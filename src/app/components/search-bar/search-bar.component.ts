import { Component, OnInit } from '@angular/core'; //decorator for angular component and lifecycle hook interface
import { CommonModule } from '@angular/common'; //provides common directives like ngIf and ngFor
import { FormControl, ReactiveFormsModule } from '@angular/forms'; //tracks value and validation status of individual input (listensn to changeds in input )
import { SearchService } from '../../services/search.service';



//RxJS imports for handling asynchronous data streams(fix the lag)
import { Observable,of } from 'rxjs';
import { switchMap,debounceTime,catchError,distinctUntilChanged } from 'rxjs/operators';



@Component({
  selector: 'app-search-bar', //custom html tag to use this component
  standalone: true, //indicates that this component is self-contained and does not require a module
  imports: [CommonModule, ReactiveFormsModule], //modules that this component depends on
  templateUrl: './search-bar.component.html', //path to html template
  styleUrls: ['./search-bar.component.css'], //path to css styles
})
export class SearchBarComponent implements OnInit {
  //implements OnInit to use ngOnInit lifecycle hook
  searchControl: FormControl = new FormControl(''); //form control to track input value and status
//   results: string[] = []; //array to hold search results


results$!: Observable<string[]>; //observable to hold search results (fix the lag)


  constructor(private searchService: SearchService) {} //injecting SearchService to use its methods(dependency injection)



  //nested subscription will cause lag in UI
  ngOnInit(): void {//runs after component initialization
    this.results$ = this.searchControl.valueChanges.pipe( //listens to changes in the input field
        debounceTime(300), //waits for 300ms of inactivity before emitting the latest value (prevents excessive calls to search service)
        distinctUntilChanged(), //only emits when the current value is different from the last value (prevents duplicate searches)
        switchMap(term=>
        {
            if(term && term.trim())//remove whitespaces(from both ends) and check if term is not empty
            {
                return this.searchService.getResults(term);
            }
            else
            {
                return of([]); //return empty array if term is empty or whitespace
            }
        }),
        catchError(err=>{
            console.error('Search error:',err);
            return of([]); //return empty array on error to keep the UI responsive
        })
    );
  }
}
