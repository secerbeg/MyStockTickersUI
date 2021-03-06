import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ToastsManager } from "ng2-toastr";
import { StockToBuyFactory } from '../../model/factory/stock-to-buy.factory';
import { StockNotesController } from '../stock-notes/stock-notes-controller';
import { StockNotesStateStore } from '../stock-notes/stock-notes-state-store';
import { StockNotesFactory } from '../../model/factory/stock-notes.factory';
import { StockToBuyStateStore } from './stock-to-buy-state-store';
import { StockToBuyController } from './stock-to-buy-controller';
import { StockToBuyCrudService } from '../../service/crud/stock-to-buy-crud.service';
import { StockQuoteCacheService } from '../../service/cache/stock-quote-cache.service';
import { CookieService } from 'ngx-cookie-service';
import { StockModelObjectTableLayoutComponent } from '../stock-table/stock-model-object-table-layout.component';
import { StockModelObjectTableComponent } from '../common/stock-model-object-table-component';
import { StockToBuy } from '../../model/entity/stock-to-buy';
import { isNullOrUndefined } from 'util';
import { TableLoadingStrategy } from '../common/table-loading-strategy';
import { StockNotes } from '../../model/entity/stock-notes';
import { StockNotesActionTaken } from '../../common/stock-notes-action-taken.enum';
import { StockNotesSentiment } from '../../common/stock-notes-sentiment.enum';
import { StockNotesStock } from '../../model/entity/stock-notes-stock';
import { DialogCloseEventType } from '../crud/common/close-button-event';
import { CrudOperation } from '../crud/common/crud-operation';

/**
 * This component displays a list of Stocks to buy.
 *
 * Created by mike on 07/10/2018.
 */
@Component(
{
    selector:    'stock-to-buy-table',
    styleUrls:   ['./stock-to-buy-table.component.css'],
    templateUrl: './stock-to-buy-table.component.html'
})
export class StockToBuyTableComponent extends StockModelObjectTableComponent<StockToBuy> implements AfterViewInit
{
    @ViewChild(StockModelObjectTableLayoutComponent)
    private stockModelObjectTableLayoutComponent: StockModelObjectTableLayoutComponent;

    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {StockToBuyStateStore} stockToBuyStateStore
     * @param {StockToBuyController} stockToBuyController
     * @param {StockToBuyFactory} stockToBuyFactory
     * @param {StockToBuyCrudService} stockToBuyCrudService
     * @param {StockNotesStateStore} stockNotesStateStore
     * @param {StockNotesController} stockNotesController
     * @param {StockNotesFactory} stockNotesFactory
     * @param {StockQuoteCacheService} stockQuoteCacheService
     * @param {CookieService} cookieService
     */
    public constructor( protected changeDetector: ChangeDetectorRef,
                        protected toaster: ToastsManager,
                        protected stockToBuyStateStore: StockToBuyStateStore,
                        protected stockToBuyController: StockToBuyController,
                        protected stockToBuyFactory: StockToBuyFactory,
                        protected stockToBuyCrudService: StockToBuyCrudService,
                        protected stockNotesStateStore: StockNotesStateStore,
                        protected stockNotesController: StockNotesController,
                        protected stockNotesFactory: StockNotesFactory,
                        protected stockQuoteCacheService: StockQuoteCacheService,
                        protected cookieService: CookieService )
    {
        super( changeDetector,
               TableLoadingStrategy.LAZY_ON_CREATE,
               toaster,
               stockToBuyStateStore,
               stockToBuyController,
               stockToBuyFactory,
               stockToBuyCrudService,
               cookieService );
        this.displayStockSearchFilter = true;
    }

    /**
     * Determines if the stockToBuy.buyAfterDate is > the current date
     * @param {StockToBuy} stockToBuy
     * @returns {boolean}
     */
    protected isAfterBuyAfterDate( stockToBuy: StockToBuy )
    {
        if ( isNullOrUndefined( stockToBuy.buyAfterDate ) )
            return true;
        let today: Date = new Date();
        let buyAfterDate: Date = new Date( stockToBuy.buyAfterDate );
        return buyAfterDate.getTime() > today.getTime();
    }

    /**
     * This method is called when the user clicks the "Record Buy" button in the table.
     * The buy information contained within the StockToBuy for that row clicked will be converted to a StockToBuy
     * instances so that a note can be created to document the purchase of a stock.
     * The stock notes dialog will display to allow the user to enter note information and if the note is created
     * then the user will be prompted to delete the stock to buy entry if they want.
     * @param {StockToBuy} stockToBuy
     */
    protected onBuyButtonClick( stockToBuy: StockToBuy )
    {
        const methodName: string = 'onBuyButtonClick ';
        this.log( methodName + " " + JSON.stringify( stockToBuy ));
        /*
         * Convert the StockToBuy information into a StockNote instance so that the user can record the buy
         */
        let stockNotes: StockNotes = this.stockNotesFactory.newModelObject();
        stockNotes.tickerSymbol = stockToBuy.tickerSymbol;
        stockNotes.notes = stockToBuy.comments;
        stockNotes.actionTaken = StockNotesActionTaken.BUY;
        stockNotes.bullOrBear = StockNotesSentiment.BULL;
        stockNotes.setNotesSourceId( stockToBuy.notesSourceId );
        stockNotes.setNotesSourceName( stockToBuy.notesSourceName );
        stockNotes.tags = stockToBuy.tags;
        let stockNoteStock: StockNotesStock = new StockNotesStock();
        stockNoteStock.tickerSymbol = stockNotes.tickerSymbol;
        stockNoteStock.stockPrice = stockToBuy.stockPriceQuote.lastPrice;
        stockNoteStock.customerId = stockToBuy.customerId;
        stockNotes.stocks = [stockNoteStock];
        this.log( "StockNotes: " + JSON.stringify( stockNotes ));
        /*
         * Register to get notified when the user closes the stock notes dialog to determine if the user should
         * be prompted to delete the stock to buy entry.
         */
        this.stockNotesController
            .subscribeToDialogCloseButtonClickedEvent( ( event: DialogCloseEventType ) =>
                                                       {
                                                           this.log( methodName + " stock notes closed button clicked event: " + event );
                                                           if ( event != DialogCloseEventType.CANCEL_BUTTON )
                                                           {
                                                               this.stockToBuyController
                                                                   .sendTableDeleteButtonClickedEvent( stockToBuy );
                                                           }
                                                       })
        /*
         * Display the stock notes dialog.
         */
        this.stockNotesStateStore
            .sendCrudOperationChangedEvent( CrudOperation.CREATE );
        this.stockNotesStateStore
            .sendModelObjectChangedEvent( this, stockNotes );
        this.stockNotesController
            .sendDialogDisplay( true );
    }
}
