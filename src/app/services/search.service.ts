import { Injectable } from "@angular/core";//decorator to make this class injectable 
import { Observable,of, throwError } from "rxjs";//RxJS class representing a stream of data, and a function to create an observable from a static value
import { delay } from "rxjs/operators";//pauses the observable stream for a specified duration

@Injectable({
    providedIn: 'root'//makes the service available throughout the application 
    //can be used with providers array in a specific module or component if you want to limit its scope(not recommended ) 
})


export class SearchService {
    getResults(term:string): Observable<string[]> {//returns an observable that emmits an array of strings 
        
        console.log(`Searching for: ${term}`); // Log the search term to the console
        
        const mockData = [//irl this would be an http request to a backend server to fetch search results based on the term provided
            `${term} result 1`,
            `${term} result 2`,
            `${term} result 3`
        ];

        // return throwError(() => new Error('Simulated network error')).pipe(delay(500)); // Simulate a network error with a delay of 500ms



        return of(mockData).pipe(delay(500)); // Simulate a delay of 500ms before emitting the results
        //of makes thearray an observable for async handdling 
        //pipe() is an RxJS funtion used to combine multiple operators (its not same as angular pipe)
        //this delay  and manual data updation causes a lag 
    
    
    }   
}