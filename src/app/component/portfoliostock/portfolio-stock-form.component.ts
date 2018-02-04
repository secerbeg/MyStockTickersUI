import { Component, Input, OnInit } from "@angular/core";
import { PortfolioStock } from "../../model/entity/portfolio-stock";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/components/common/api";
import { CrudFormComponent } from "../crud/form/crud-form.component";
import { StockSectorList } from "../../model/entity/stock-sectors.list";
import { StockSectorCrudService } from "../../service/crud/stock-sector-crud.service";
import { ToastsManager } from "ng2-toastr";
import { StockCrudServiceContainer } from "../stock/stock-crud-service-container";
import { PortfolioStockCrudServiceContainer } from "./portfolio-stock-crud-service-container";
import { Portfolio } from "../../model/entity/portfolio";
import { isNullOrUndefined } from "util";
import { StockQuote } from "../../model/entity/stock-quote";
import { PortfolioStockStateStore } from './portfolio-stock-state-store';
import { PortfolioController } from '../portfolio/portfolio-controller';
import { PortfolioStockController } from './portfolio-stock-controller';
import { PortfolioStockCrudService } from '../../service/crud/portfolio-stock-crud.service';
import { PortfolioStockFactory } from '../../model/factory/portfolio-stock.factory';
import { StockCrudService } from '../../service/crud/stock-crud.service';

/**
 * Created by mike on 11/16/2016.
 */
@Component(
{
    selector:    'portfolio-stock-form',
    templateUrl: './portfolio-stock-form.component.html',
    styleUrls: ['../crud/form/crud-form.component.css',
                './portfolio-stock-form.component.css']
})
export class PortfolioStockFormComponent extends CrudFormComponent<PortfolioStock> implements OnInit
{
    @Input()
    private portfolio: Portfolio;
    private stockSectorMap: StockSectorList = new StockSectorList();
    private stockSubSectors: SelectItem[];
    private stockSectors: SelectItem[];
    private dataLoaded: boolean = true;
    private selectedStockQuote: StockQuote;

    constructor( protected toaster: ToastsManager,
                 protected formBuilder: FormBuilder,
                 protected stockSectorService: StockSectorCrudService,
                 protected portfolioStockStateStore: PortfolioStockStateStore,
                 protected portfolioStockController: PortfolioStockController,
                 protected portfolioStockFactory: PortfolioStockFactory,
                 protected stockCrudService: StockCrudService )
    {
        super( toaster,
               portfolioStockStateStore,
               portfolioStockController,
               portfolioStockFactory );

        this.continuousAdd = true;
    }

    /**
     * This method is called when the user selects a stock using the stock/company search input
     * @param stock
     */
    private onStockSelected( stockQuote )
    {
        this.debug( "onStockSelected: " + JSON.stringify( stockQuote ));
        this.selectedStockQuote = stockQuote;
        this.modelObject.lastPrice = stockQuote.lastPrice;
        this.modelObject.tickerSymbol = stockQuote.tickerSymbol;
        this.modelObject.companyName = stockQuote.companyName;
        (<FormControl>this.formGroup.controls['tickerSymbol']).setValue( stockQuote.tickerSymbol );
        (<FormControl>this.formGroup.controls['companyName']).setValue( stockQuote.companyName );
        (<FormControl>this.formGroup.controls['lastPrice']).setValue( stockQuote.lastPrice );
    }

    /**
     * This method is called when the ticker symbol input loses focus
     */
    private onTickerSymbolLostFocus(): void
    {
        var methodName = "onTickerSymbolLostFocus";
        this.debug( methodName + " selectedStock: " + JSON.stringify( this.selectedStockQuote ) );
        /*
         * It's possible that the ticker symbol does not exist in the database so load it after the user has
         * pressed the tab key
         */
        if ( (!this.selectedStockQuote || this.selectedStockQuote.tickerSymbol != this.getTickerSymbolFormValue()) &&
              !isNullOrUndefined( this.getTickerSymbolFormValue() ))
        {
            this.stockCrudService.getStock( this.getTickerSymbolFormValue() )
                .subscribe( (stock) =>
                            {
                                this.debug( methodName + " found: " + stock.tickerSymbol );
                                this.onStockSelected( stock );
                            },
                            error =>
                            {
                                this.resetForm();
                                this.reportRestError( error );
                            });
        }
    }

    private getTickerSymbolFormValue(): string
    {
        return (<FormControl>this.formGroup.controls['tickerSymbol']).value;
    }

    /**
     * Create the form.  This method is called by the super class
     * @return {FormGroup}
     */
    protected createFormGroup(): FormGroup
    {
        var formGroup: FormGroup = this.formBuilder.group(
        {
            'stockSearch':        '',
            'tickerSymbol':       new FormControl( '', Validators.required ),
            'companyName':        '',
            'numberOfShares':     '',
            'averageUnitCost':    '',
            'lastPrice':          '',
            'sector':             '',
            'subSector':          '',
            'realizedGains':      '',
            'realizedLosses':     '',
            'stopLossPrice':      '',
            'stopLossShares':     '',
            'profitTakingPrice':  '',
            'profitTakingShares': ''
        } );
        return formGroup;
    }

    /**
     * Loads the stock sectors
     */
    private loadStockSectorMap()
    {
        this.stockSectorService
            .getStockSectors()
            .subscribe( ( data ) =>
                        {
                            this.debug( 'stock sector data: ' + JSON.stringify( data ) );
                            this.stockSectorMap.load( data );
                            this.stockSectors = this.stockSectorMap.getSectorSelectItems();
                            this.debug( 'stockSectors: ' + JSON.stringify( this.stockSectors ) );
                            this.dataLoaded = true;
                        },
                        error =>
                        {
                            this.reportRestError( error );
                        }
            );
    }

    /**
     * This method is called when the user selects a stock sector.
     * When this occurs, the sub sector dropdown is populated with the sub sectors
     * @param event
     */
    public onStockSectorChange( event )
    {
        this.debug( "onStockSectorChange: " + JSON.stringify( event.value ));
        this.stockSubSectors = this.stockSectorMap.getSubSectors( event.value.name );
        this.debug( "onStockSectorChange: " + JSON.stringify( this.stockSubSectors ));
    }

    public onMenuSelect( sector, subSector ): void
    {
        alert( "onMenuSelect sector: " + sector + " subSector: " + subSector );
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

    /**
     * Determines if the company name is invalid
     * @returns {boolean}
     */
    public isCompanyNameInvalid(): boolean
    {
        return !this.formGroup.controls['companyName'].valid &&
               this.formGroup.controls['companyName'].dirty;
    }

    protected readOnlyFields(): Array<string>
    {
        return ['tickerSymbol'];
    }
}
