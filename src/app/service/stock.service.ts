/**
 * Created by mike on 9/14/2016.
 */

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import '../rxjs-operators';

import { Stock } from '../model/stock';
import { PaginationPage } from '../common/pagination';
import { PaginationURL } from '../common/pagination-url';
import { SessionService } from "./session.service";
import { Logger } from "./logger.service";

@Injectable()
export class StockService
{
    private stocksUrl: string = 'http://localhost:8080/stocks';
    private stocksCompaniesLikeUrl: string = this.stocksUrl + '/companieslike/';
    private stocksPaginationUrl: PaginationURL;
    private stocksCompaniesLikePaginationUrl: PaginationURL;

    constructor( private http: Http,
                 private session: SessionService,
                 private logger: Logger )
    {
        this.stocksPaginationUrl = new PaginationURL( logger, this.stocksUrl );
        this.stocksCompaniesLikePaginationUrl = new PaginationURL( logger, this.stocksCompaniesLikeUrl );
        this.logger.setClassName( StockService.name );
    }

    /**
     * Retrieves a specific page of stocks
     * @param rowOffSet The page to retrieve
     * @param rows The numbers of rows per page (rows to return for this page)
     * @returns {Observable<PaginationPage<Stock>>}
     */
    public getStocksPage( rowOffSet: number, rows: number, searchString: string ): Observable<PaginationPage<Stock>>
    {
        let methodName = "getStocksPage";
        this.logger.log( `${methodName} url: ${this.stocksUrl} rowOffset: ${rowOffSet} rows: ${rows} searchString: ${searchString}` );
        if ( searchString == null )
        {
            return this.http.get( this.stocksPaginationUrl.getPage( rowOffSet, rows ) )
                .map( ( response: Response ) => response.json() )
                .catch( ( error: any ) => Observable.throw( error.json().error || 'Server error' ) );
        }
        else
        {
            this.stocksCompaniesLikePaginationUrl.setUrl( this.stocksCompaniesLikeUrl + '/' + searchString );
            return this.http.get( this.stocksCompaniesLikePaginationUrl.getPage( rowOffSet, rows ) )
                .map( ( response: Response ) => response.json() )
                .catch( ( error: any ) => Observable.throw( error.json().error || 'Server error' ) );
        }
    }

    /**
     * Get a stock by the ticker symbol
     * @param tickerSymbol
     * @returns {Observable<R>}
     */
    public getStock( tickerSymbol: string ): Observable<Stock>
    {
        let methodName = "getStock";
        this.logger.log( methodName + " tickerSymbol: " + tickerSymbol );
        return this.http.get( `${this.stocksUrl}/${tickerSymbol}` ) // ...using put request
            .map( ( res: Response ) => res.json() ) // ...and calling .json() on the response to return data
            .catch( ( error: any ) => Observable.throw( error.json().error || 'Server error' ) ); //...errors if any
    }

    /**
     * Add a new stock
     * @param stock
     * @returns {Observable<R>}
     */
    public addStock( stock: Stock ): Observable<Stock[]>
    {
        let methodName = "addStock";
        stock.createdBy = this.session.getLoggedInUserId();
        stock.userEntered = true;
        let bodyString = JSON.stringify( stock ); // Stringify payload
        this.logger.log( methodName + " " + bodyString );
        let headers = new Headers( { 'Content-Type': 'application/json' } ); // ... Set content type to JSON
        let options = new RequestOptions( { headers: headers } ); // Create a request option

        return this.http.post( this.stocksUrl, bodyString, options ) // ...using post request
            .map( ( res: Response ) => res.json() ) // ...and calling .json() on the response to return data
            .catch( ( error: any ) => Observable.throw( error.json().error || 'Server error' ) ); //...errors if any
    }

    /**
     * Update a stock
     * @param stock
     * @returns {Observable<R>}
     */
    public updateStock( stock: Stock ): Observable<Stock[]>
    {
        let methodName = "updateStock";
        let bodyString = JSON.stringify( stock ); // Stringify payload
        this.logger.log( methodName + " " + bodyString );
        let headers = new Headers( { 'Content-Type': 'application/json' } ); // ... Set content type to JSON
        let options = new RequestOptions( { headers: headers } ); // Create a request option
        let url =  this.stocksUrl + "/" + stock.tickerSymbol;
        this.logger.log( methodName + " url: " + url );

        return this.http.put( url, bodyString, options ) // ...using put request
            .map( ( res: Response ) => res.json() ) // ...and calling .json() on the response to return data
            .catch( ( error: any ) => Observable.throw( error.json().error || 'Server error' ) ); //...errors if any
    }

    /**
     * Delete a stock
     * @param stock
     * @returns {Observable<R>}
     */
    public deleteStock( stock: Stock ): Observable<Stock[]>
    {
        let methodName = "deleteStock";
        this.logger.log( methodName + " " + JSON.stringify( stock ) );
        let url = this.stocksUrl + "/" + stock.tickerSymbol;
        this.logger.log( methodName + " url: " + url ) ;
        return this.http.delete( url ) // ...using delete request
            .map( ( res: Response ) => res.json() ) // ...and calling .json() on the response to return data
            .catch( ( error: any ) => Observable.throw( error.json().error || 'Server error' ) ); //...errors if any
    }

    private handleError (error: any)
    {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    /**
     * Determines if the user (userId) is allowed to edit or delete the stock
     * @param stock
     * @param userId
     * @returns true if the stock was entered by the logged in user, then he can change it.
     *          Or if it is me logged in :-)
     */
    public canEditOrDelete( stock: Stock, userId: number )
    {
        var canEditOrDelete = false;
        if ( stock.userEntered )
        {
            if ( stock.createdBy == userId ||
                 this.session.isAdminUser() )
            {
                canEditOrDelete = true;
            }
        }
        return canEditOrDelete;
    }
}