import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Component } from "@angular/core";
import { ToastsManager } from "ng2-toastr";
import { Stock } from "../../model/entity/stock";
import { CrudFormComponent } from "../crud/form/crud-form.component";
import { StockAnalytics } from "../../model/entity/stock-analytics";
import { StockAnalyticsCrudServiceContainer } from "./stock-analytics-crud-service-container";
import { SessionService } from "../../service/crud/session.service";

/**
 * This is the Stock Analytics Form Component class.
 *
 * Created by mike on 10/17/2017.
 */
@Component( {
                selector: 'stock-analytics-form',
                styleUrls: ['../crud/form/crud-form.component.css',
                            './stock-analytics-form.component.css'],
                templateUrl: './stock-analytics-form.component.html'
            } )
export class StockAnalyticsFormComponent extends CrudFormComponent<StockAnalytics>
{
    constructor( protected toaster: ToastsManager,
                 protected sessionService: SessionService,
                 private formBuilder: FormBuilder,
                 private stockAnalyticsCrudServiceContainer: StockAnalyticsCrudServiceContainer )
    {
        super( toaster, stockAnalyticsCrudServiceContainer );
    }

    /**
     * Creates and identifies the fields for the FormGroup instance for the stock notes form.
     * @return {FormGroup}
     */
    protected createCrudForm(): FormGroup
    {
        this.debug( "createCrudForm " );
        var stockNoteForm: FormGroup = this.formBuilder.group(
            {
                'tickerSymbol':             new FormControl( this.modelObject.tickerSymbol, Validators.required ),
                'comments':                 new FormControl( this.modelObject.comments ),
                'analystStrongBuyCount':    new FormControl( this.modelObject.analystStrongBuyCount ),
                'analystBuyCount':          new FormControl( this.modelObject.analystBuyCount ),
                'analystHoldCount':         new FormControl( this.modelObject.analystHoldCount ),
                'analystUnderPerformCount': new FormControl( this.modelObject.analystUnderPerformCount ),
                'analystSellCount':         new FormControl( this.modelObject.analystSellCount ),
                'avgAnalystPriceTarget':    new FormControl( this.modelObject.avgAnalystPriceTarget ),
                'lowAnalystPriceTarget':    new FormControl( this.modelObject.lowAnalystPriceTarget ),
                'highAnalystPriceTarget':   new FormControl( this.modelObject.highAnalystPriceTarget )
            } );
        return stockNoteForm;
    }

    /**
     * This method is called when the user selects a stock using the stock/company search input
     * @param stock
     */
    public onStockSelected( stock: Stock )
    {
        this.debug( "onStockSelected: " + JSON.stringify( stock ) );
        this.modelObject.companyName = stock.companyName;
        this.modelObject.lastPrice = stock.lastPrice;
        this.modelObject.tickerSymbol = stock.tickerSymbol;
    }

    /**
     * Determines if the ticker symbol is invalid
     * @returns {boolean}
     */
    public isTickerSymbolInvalid(): boolean
    {
        return !this.formGroup.controls['tickerSymbol'].valid &&
               this.formGroup.controls['tickerSymbol'].dirty;
    }
}
