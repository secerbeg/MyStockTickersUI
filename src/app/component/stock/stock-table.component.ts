import { Component,
         OnInit }         from "@angular/core";
import { Router }         from '@angular/router';
import { Stock }          from "../../model/stock";
import { StockService }   from "../../service/stock.service";
import { Logger }         from "../../service/logger.service";
import { PaginationPage } from "../../common/pagination";
import { LazyLoadEvent }  from "primeng/components/common/api";
import { CrudOperation }  from "../../common/crud-operation";
import { SessionService } from "../../service/session.service";

@Component( {
    selector:    'stock-table',
    templateUrl: 'stock-table.component.html',
    styleUrls:   ['stock-table.component.css'],
    providers:   [Logger]
} )
export class StockTableComponent implements OnInit
{
    /*
     * Instance variables
     */
    private stocksPage: PaginationPage<Stock>;
    private selectedStock: Stock = null;
    private displayableStock: Stock;
    private crudOperation: CrudOperation;
    private totalRecords: number;
    private companyNameSearch: string;

    /**
     * Create a new instance with required DI sources
     * @param stockService
     * @param router
     */
    constructor( private logger: Logger,
                 private stockService: StockService,
                 private router: Router,
                 private session: SessionService )
    {
        this.logger.setClassName( StockTableComponent.name );
        this.stocksPage =
        {
            content : [],
            last: false,
            first: true,
            number: 1,
            size: 20,
            totalElements: 0,
            totalPages : 0,
            itemsPerPage: 20,
            sort: []
        }
    }

    /**
     * This event is triggered by the DataTable containing the stocks to request the load of a new page of stocks
     * @param event
     */
    public lazyLoadData( event: LazyLoadEvent ) : void
    {
        this.logger.log( 'loadData ' + JSON.stringify( event ) );
        this.loadPage( event.first,  event.rows );
    }

    /**
     * Load a page of stocks
     * @param pageNumber
     * @param rows
     */
    private loadPage( pageNumber: number, rows: number, searchString?: string )
    {
        this.logger.log( `loadPage pageNumber ${pageNumber} rows: ${rows} searchString: ${searchString}` );
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort in single sort mode
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec in single sort mode
        //multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
        //filters: Filters object having field as key and filter value, filter matchMode as value
        this.stockService
            .getStocksPage( pageNumber, rows, searchString )
            .subscribe( stocksPage =>
                        {
                            this.setStocksPage( stocksPage );
                            //alert( JSON.stringify( stocksPage))
                        }, //Bind to view
                        err =>
                        {
                            // Log errors if any
                            console.log( err );
                        } );
    }

    /**
     * A new stock page has been received
     * @param stocksPage
     */
    private setStocksPage( stocksPage: PaginationPage<Stock> ): void
    {
        //this.logger.log( JSON.stringify( stocksPage ).valueOf() );
        this.totalRecords = stocksPage.totalElements;
        this.stocksPage = stocksPage;
        this.logger.log( 'setStocksPage: length: ' + stocksPage.content.length );
        this.logger.log( 'setStocksPage: totalElements: ' + stocksPage.totalElements );
    }

    /**
     * Jump to the stock detail component
     */
    private gotoStockDetail(): void
    {
        let link = ['/stockDetail', this.selectedStock.tickerSymbol];
        this.router.navigate(link);
    }
    private showFormToAdd()
    {
        this.crudOperation = CrudOperation.INSERT;
        this.displayableStock = new Stock( '', '', '', 0, false );
    }

    private showFormToEdit()
    {
        this.crudOperation = CrudOperation.UPDATE;
        this.displayableStock = this.selectedStock;
    }

    private confirmDelete()
    {
        this.crudOperation = CrudOperation.DELETE;
        this.displayableStock = this.selectedStock;
    }

    private save()
    {
        if ( this.crudOperation == CrudOperation.INSERT  )
        {
            this.stocksPage.content.push( this.displayableStock );
        }
        else
        {
            this.stocksPage.content[this.findSelectedStockIndex()] ;
            this.displayableStock = null;
        }
    }

    /**
     * Determines the index of selectedStock in the stockPage.content array
     * @returns {number}
     */
    private findSelectedStockIndex(): number
    {
        for ( var i = 0; i < this.stocksPage.content.length; i++ )
        {
            var stock = this.stocksPage.content[i];
            if ( stock.tickerSymbol === this.selectedStock.tickerSymbol )
            {
                return i;
            }
        }
        throw new Error( "Could not find ticker symbol " + this.selectedStock.tickerSymbol );
    }

    /**
     * Determines if the user can edit or delete the stock
     * @returns {boolean}
     */
    private canEditOrDeleteSelectedStock(): boolean
    {
        var canEditOrDelete = false;
        if ( this.selectedStock )
        {
            canEditOrDelete = this.stockService.canEditOrDelete( this.selectedStock,
                                                                 this.session.getLoggedInUserId() );
        }
        return canEditOrDelete;
    }

    public isEditButtonDisabled(): boolean
    {
        return !this.canEditOrDeleteSelectedStock();
    }

    public isDeleteButtonDisabled(): boolean
    {
        return !this.canEditOrDeleteSelectedStock();
    }

    public isAddButtonDisabled(): boolean
    {
        return false;
    }

    /*****************************************************************
     *  E V E N T S
     *****************************************************************/
    private onCompanyNameSearch( event )
    {
        this.logger.log( 'onCompanyNameSearch()' + this.companyNameSearch );
        this.loadPage( 1, 20, this.companyNameSearch )
    }

    private onClearCompanySearch( event )
    {
        this.companyNameSearch = '';
    }

    private onEditComplete( event ): void
    {
        this.logger.log( 'onEditComplete()' );
        this.stockService.updateStock( this.selectedStock );
    }

    /**
     * On application start up initialization
     */
    public ngOnInit(): void
    {
        //this.logger.log( 'ngOnInit()' );
        //this.loadPage( 0, 20 );
    }

    public onStockFormOkButton(): void
    {
        this.logger.log( 'onStockFormOkButton()' );
    }

    public onStockFormCancelButton(): void
    {
        this.logger.log( 'onStockFormCancelButton()' );
    }

    /**
     * this method is called when the user selects a row in the stock table
     * @param event
     */
    private onRowSelect( event ): void
    {
        this.logger.log( 'onRowSelect() ' + JSON.stringify( event ) );
        this.selectedStock = event.data;
        this.displayableStock = this.selectedStock;
    }
}
