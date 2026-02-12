import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'; //decorator for angular component and lifecycle hook interface
import { CommonModule } from '@angular/common'; //provides common directives like ngIf and ngFor
import { FormControl, ReactiveFormsModule } from '@angular/forms'; //tracks value and validation status of individual input (listensn to changeds in input )
import { SearchService } from '../../services/search.service';

//RxJS imports for handling asynchronous data streams(fix the lag)
import { Observable, of,BehaviorSubject } from 'rxjs';
import { switchMap, debounceTime, catchError, distinctUntilChanged,tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar', //custom html tag to use this component
  standalone: true, //indicates that this component is self-contained and does not require a module
  imports: [CommonModule, ReactiveFormsModule], //modules that this component depends on
  templateUrl: './search-bar.component.html', //path to html template
  styleUrls: ['./search-bar.component.css'], //path to css styles

  changeDetection:ChangeDetectionStrategy.OnPush 
})
export class SearchBarComponent implements OnInit {
  //implements OnInit to use ngOnInit lifecycle hook
  searchControl: FormControl = new FormControl('',{nonNullable: true}); //form control to track input value and status
  //   results: string[] = []; //array to hold search results

  results$!: Observable<string[]>; //observable to hold search results (fix the lag)


  isLoading$ = new BehaviorSubject<boolean>(false); //BehaviorSubject to track loading state
  errorMessage$ = new BehaviorSubject<string|null >(null); //BehaviorSubject to track error messages

  constructor(private searchService: SearchService) {} //injecting SearchService to use its methods(dependency injection)

  //nested subscription will cause lag in UI
  ngOnInit(): void {
    //runs after component initialization
    this.results$ = this.searchControl.valueChanges.pipe(
      //listens to changes in the input field
      debounceTime(300), //waits for 300ms of inactivity before emitting the latest value (prevents excessive calls to search service)
      distinctUntilChanged(),//only emits when the current value is different from the last value (prevents duplicate searches)
      
      
      tap(()=>{this.isLoading$.next(true); this.errorMessage$.next(null);}),


      
      switchMap(term => {
       if(!term || !term.trim()) {
        this.isLoading$.next(false);
        return of([]); //if the search term is empty or only whitespace, return an empty array
       }
       return this.searchService.getResults(term).pipe(
        tap(() => this.isLoading$.next(false)), //set loading to false when results are received
        catchError(err => {
         this.errorMessage$.next('An error occurred while fetching results. Please try again.'); //set error message if an error occurs
            this.isLoading$.next(false); //set loading to false if an error occurs
            return of([]); //return an empty array if an error occurs


        })
       );
      }),
    );
  }


  clearSearch(): void {
    this.searchControl.setValue(''); //clears the input field by setting its value to an empty string
    this.isLoading$.next(false); //set loading to false when clearing search
    this.errorMessage$.next(null); //clear any error messages when clearing search
    //this will trigger the valueChanges observable and clear the results as well
    
    
    
  }
}
