/**
 * Created by mike on 3/10/2018
 */
import { StockPosition } from '../../model/entity/stock-position';
import { ChangeDetectorRef, Component } from '@angular/core';
import { StockPositionCrudService } from '../../service/crud/stock-position-crud.service';
import { StockPositionController } from './stock-position-controller';
import { StockPositionStateStore } from './stock-position-state-store';
import { SessionService } from '../../service/session.service';
import { ToastsManager } from 'ng2-toastr';
import { CrudTableRefreshButtonComponent } from '../crud/table/crud-table-refresh-button.component';
import { StockPositionFactory } from '../../model/factory/stock-position-factory';

@Component
({
    selector: 'stock-position-table-refresh-button',
    styles: [` 
                div.synchronize-table-button
                {
                    display: inline-block;
                    width: 140px;
                    height: 35px;
                }
    `],
    templateUrl: '../crud/table/crud-table-button.component.html'
 })
export class StockPositionTableRefreshButtonComponent extends CrudTableRefreshButtonComponent<StockPosition>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} session
     * @param {StockPositionStateStore} portfolioStockStateStore
     * @param {StockPositionController} portfolioStockController
     * @param {StockPositionFactory} portfolioStockFactory
     * @param {StockPositionCrudService} portfolioStockCrudService
     */
    constructor( protected changeDetector: ChangeDetectorRef,
                 protected toaster: ToastsManager,
                 private session: SessionService,
                 private portfolioStockStateStore: StockPositionStateStore,
                 private portfolioStockController: StockPositionController,
                 private portfolioStockFactory: StockPositionFactory,
                 private portfolioStockCrudService: StockPositionCrudService )
    {
        super( changeDetector,
               toaster,
               portfolioStockStateStore,
               portfolioStockController,
               portfolioStockFactory,
               portfolioStockCrudService );
    }

    public ngOnInit(): void
    {
        super.ngOnInit();
        this.buttonLabel = 'Synchronize';
        this.buttonDivClass = 'synchronize-table-button';
    }
}
