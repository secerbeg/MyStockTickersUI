/**
 * This class manages a Spring REST URL including the oonversion
 * from a PrimeNG DataTable pagination request (page load) to a
 * proper Spring REST paging request
 *
 * Created by mike on 10/5/2016.
 */
import { LoggerFactory } from "./logger-factory";
import { Logger } from "./logger";
import { LazyLoadEvent } from "primeng/primeng";
import { isNullOrUndefined } from 'util';

export class PaginationURL
{
    private url: string;
    private logger: Logger;

    /**
     * Create a new instance
     * @param url The base URL to which the page number and number of rows will be added
     *        to make a proper request to a Spring REST service
     */
    constructor( url: string )
    {
        this.url = url;
        this.logger = LoggerFactory.getLogger( PaginationURL.name );
    }

    /**
     * Get the url without any pagination
     * @returns {any}
     */
    public getUrl(): string
    {
        return this.url;
    }

    public setUrl( url: string )
    {
        this.url = url;
    }

    /**
     * Format the URL to make a Spring REST page request
     * @param pageNumber Starting at page number
     * @param rows The number of rows to retrieve
     * @returns {any}
     */
    public getPageWithSearchString( searchString: string, rowOffSet: number, rows: number  ): string
    {
        /*
         * Need to calculate the page number from the rowOffSet
         */
        this.logger.log( `getPage ${searchString} rowOffset: ${rowOffSet} rows: ${rows}` )
        var pageNumber = ((rowOffSet + rows) / rows) - 1;
        var url = `${this.url}/${searchString}?page=${pageNumber}&limit=${rows}`;
        this.logger.log( "getPage url: " + url );
        return url;
    }

    /**
     * Format the URL to make a Spring REST page request
     * @param pageNumber Starting at page number
     * @param rows The number of rows to retrieve
     *
     * https://docs.spring.io/spring-data/rest/docs/2.0.0.M1/reference/html/paging-chapter.html
     *
     * @returns {any}
     */
    public getPage( lazyLoadEvent: LazyLoadEvent  ): string
    {
        let methodName = "getPage";
        /*
         * Need to calculate the page number from the rowOffSet
         */
        this.logger.log( methodName + " " + JSON.stringify( lazyLoadEvent ));
        if ( isNullOrUndefined( lazyLoadEvent ))
        {
            throw ReferenceError( "lazyLoadEvent is null.  Cannot create getPage URL" );
        }
        var pageNumber = ((lazyLoadEvent.first + lazyLoadEvent.rows) / lazyLoadEvent.rows) - 1;
        var url = this.url + "?page=" + pageNumber + "&limit=" + lazyLoadEvent.rows;
        if ( lazyLoadEvent.sortField )
        {
            url += `&sort=${lazyLoadEvent.sortField},`;
            url += lazyLoadEvent.sortOrder == 1 ? "asc" : "desc";
        }
        this.logger.log( methodName + " url: " + url );
        return url;
    }
}
