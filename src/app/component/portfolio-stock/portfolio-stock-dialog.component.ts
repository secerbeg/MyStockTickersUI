import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { ToastsManager } from "ng2-toastr";
import { CrudDialogComponent } from "../crud/dialog/crud-dialog.component";
import { PortfolioStock } from "../../model/entity/portfolio-stock";
import { Portfolio } from "../../model/entity/portfolio";
import { PortfolioStockStateStore } from './portfolio-stock-state-store';
import { PortfolioStockController } from './portfolio-stock-controller';
import { PortfolioStockFactory } from '../../model/factory/portfolio-stock.factory';
import { PortfolioStockCrudService } from '../../service/crud/portfolio-stock-crud.service';

/**
 * This class manages the modal dialog that contains the Portfolio StockCompany
 * editing fields
 *
 * Created by mike on 11/19/2016.
 */
@Component
({
    selector:    'portfolio-stock-dialog',
    templateUrl: './portfolio-stock-dialog.component.html',
    inputs:      ['portfolio']
})
export class PortfolioStockDialogComponent extends CrudDialogComponent<PortfolioStock>
{
    @Input()
    private portfolio: Portfolio;

    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {PortfolioStockStateStore} portfolioStockStateStore
     * @param {PortfolioStockController} portfolioStockController
     * @param {PortfolioStockFactory} portfolioStockFactory
     * @param {PortfolioStockCrudService} portfolioStockCrudService
     */
    constructor( protected changeDetector: ChangeDetectorRef,
                 protected toaster: ToastsManager,
                 private portfolioStockStateStore: PortfolioStockStateStore,
                 private portfolioStockController: PortfolioStockController,
                 private portfolioStockFactory: PortfolioStockFactory,
                 private portfolioStockCrudService: PortfolioStockCrudService )
    {
        super( changeDetector,
               toaster,
               portfolioStockStateStore,
               portfolioStockController,
               portfolioStockFactory,
               portfolioStockCrudService );
    }

    /**
     * This method is called when a 409 HTTP Code is received from a rest call.
     */
    public getDuplicateKeyErrorMessage(): string
    {
        return this.modelObject.tickerSymbol + " already exists in portfolio";
    }

    protected isContinuousAdd(): boolean
    {
        return true;
    }
}
