import { StockPriceModelObject } from '../../model/entity/stock-price-model-object';
import { Component, Input, OnInit } from '@angular/core';
import { StockPriceState } from '../../common/stock-price-state.enum';
import { BaseComponent } from './base.component';
import { ToastsManager } from 'ng2-toastr';

/**
 * This component is used for StockPriceModelObject which contains a stock price -- last price.  The stock quote last
 * price is displayed as "Loading..." if the stock quote is stale or not cached already.  Otherwise, the stock quote
 * last prices is displayed in dollars.
 */
@Component(
{
    selector: 'stock-quote-last-price',
    template: `
        <div *ngIf="isFetchingQuote(); then loading else notLoading">
        </div>
        <ng-template #loading>
            Loading...
        </ng-template>
        <ng-template #notLoading>
            <div *ngIf="stockQuote != null">
                <div class="positiveGain" *ngIf="priceChange >= 0.0">
                    <currency [currencyValue]="stockQuote.lastPrice"></currency>
                </div>
                <div class="negativeGain" *ngIf="priceChange < 0.0">
                    <currency [currencyValue]="stockQuote.lastPrice"></currency>
                </div>
            </div>
        </ng-template>
    `
})
export class StockQuoteLastPriceComponent extends BaseComponent implements OnInit
{
    @Input()
    protected stockQuote: StockPriceModelObject<any>;

    protected priceChange: number;

    /**
     * Constructor.
     * @param {ToastsManager} toaster
     */
    constructor( protected toaster: ToastsManager )
    {
        super( toaster );
    }

    /**
     * Calculate the difference once.
     */
    public ngOnInit()
    {
        this.debug( "ngOnInit " + JSON.stringify( this.stockQuote ));
        this.priceChange = this.stockQuote.lastPrice - this.stockQuote.openPrice;
    }

    /**
     * Determines if the stock last price is being fetched.
     * @return {boolean}
     */
    private isFetchingQuote(): boolean
    {
        return StockPriceState.isFetchingQuote( this.stockQuote ) ;
    }
}
