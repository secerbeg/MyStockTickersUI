import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import { ToastsManager } from "ng2-toastr";
import { Stock } from "../../model/entity/stock";
import { StockAnalystConsensus } from "../../model/entity/stock-analyst-consensus";
import { SessionService } from "../../service/session.service";
import { CrudFormWithNotesSourceComponent } from "../common/crud-form-with-notes-source.component";
import { CustomerCrudService } from "../../service/crud/customer-crud.service";
import { StockAnalystConsensusStateStore } from './stock-analyst-consensus-state-store';
import { StockAnalystConsensusController } from './stock-analyst-consensus-controller';
import { StockAnalystConsensusFactory } from '../../model/factory/stock-analyst-consensus.factory';
import { StockAnalystConsensusCrudService } from '../../service/crud/stock-analyst-consensus-crud.service';
import { CrudOperation } from '../crud/common/crud-operation';

/**
 * This is the Stock AnalystConsensus Form Component class.
 *
 * Created by mike on 10/17/2017.
 */
@Component( {
                selector: 'stock-analyst-consensus-form',
                styleUrls: ['../crud/form/crud-form.component.css',
                            './stock-analyst-consensus-form.component.css'],
                templateUrl: './stock-analyst-consensus-form.component.html'
            } )
export class StockAnalystConsensusFormComponent extends CrudFormWithNotesSourceComponent<StockAnalystConsensus>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} sessionService
     * @param {FormBuilder} formBuilder
     * @param {StockAnalystConsensusStateStore} stockAnalystConsensusStateStore
     * @param {StockAnalystConsensusController} stockAnalystConsensusController
     * @param {StockAnalystConsensusFactory} stockAnalystConsensusFactory
     * @param {StockAnalystConsensusCrudService} stockAnalystConsensusCrudService
     * @param {CustomerCrudService} customerService
     */
    constructor( protected toaster: ToastsManager,
                 protected sessionService: SessionService,
                 private formBuilder: FormBuilder,
                 private stockAnalystConsensusStateStore: StockAnalystConsensusStateStore,
                 private stockAnalystConsensusController: StockAnalystConsensusController,
                 private stockAnalystConsensusFactory: StockAnalystConsensusFactory,
                 private stockAnalystConsensusCrudService: StockAnalystConsensusCrudService,
                 protected customerService: CustomerCrudService )
    {
        super( toaster,
               stockAnalystConsensusStateStore,
               stockAnalystConsensusController,
               stockAnalystConsensusFactory,
               stockAnalystConsensusCrudService,
               customerService );
    }

    /**
     * Creates and identifies the fields for the FormGroup instance for the stock notes form.
     * @return {FormGroup}
     */
    protected createFormGroup(): FormGroup
    {
        this.debug( "initializeForm " );
        var stockNoteForm: FormGroup = this.formBuilder.group(
            {
                'tickerSymbol':             new FormControl( this.modelObject.tickerSymbol, Validators.compose(
                                                      [Validators.required,
                                                                Validators.minLength( 1 ),
                                                                Validators.maxLength( 5 )])),
                'comments':                 new FormControl( this.modelObject.comments, Validators.maxLength( 4000 )),
                'notesSource':              new FormControl( this.modelObject.notesSourceId ),
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
        let methodName = 'onStockSelected';
        this.debug( methodName + " " + JSON.stringify( stock ) );
        this.modelObject.companyName = stock.companyName;
        this.modelObject.lastPrice = stock.lastPrice;
        this.modelObject.tickerSymbol = stock.tickerSymbol;
        /*
         * Need to check to see if will create a duplicate
         */
        let duplicateObject = this.stockAnalystConsensusFactory
                                  .newModelObject();
        duplicateObject.tickerSymbol = this.modelObject.tickerSymbol;
        this.stockAnalystConsensusCrudService
            .getModelObject( duplicateObject )
            .subscribe( (currentModelObject: StockAnalystConsensus) =>
            {
                this.log( methodName + ' current DB Object: ' + JSON.stringify( currentModelObject ));
                if ( currentModelObject.tickerSymbol === this.modelObject.tickerSymbol )
                {
                    this.showInfo( 'An entry already exists for ' + currentModelObject.tickerSymbol );
                    this.stockAnalystConsensusStateStore
                        .sendCrudOperationChangedEvent( CrudOperation.UPDATE );
                    this.stockAnalystConsensusStateStore
                        .sendModelObjectChangedEvent( this, currentModelObject );
                    this.setFormValues( currentModelObject );
                }
            });
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