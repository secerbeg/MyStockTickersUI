/**
 * Created by mike on 3/10/2018
 */
import { StockToBuy } from '../../model/entity/stock-to-buy';
import { Component } from '@angular/core';
import { StockToBuyCrudService } from '../../service/crud/stock-to-buy-crud.service';
import { StockToBuyFactory } from '../../model/factory/stock-to-buy.factory';
import { StockToBuyController } from './stock-to-buy-controller';
import { StockToBuyStateStore } from './stock-to-buy-state-store';
import { SessionService } from '../../service/session.service';
import { ToastsManager } from 'ng2-toastr';
import { CrudTableRefreshButtonComponent } from '../crud/table/crud-table-refresh-button.component';
import { CrudTableCustomizeButtonComponent } from '../crud/table/crud-table-customize-button.component';

@Component
({
     selector: 'stock-to-buy-table-customize-button',
     templateUrl: '../crud/table/crud-table-button.component.html'
 })
export class StockToBuyTableCustomizeButtonComponent extends CrudTableCustomizeButtonComponent<StockToBuy>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} session
     * @param {StockToBuyStateStore} stockToBuyStateStore
     * @param {StockToBuyController} stockToBuyController
     * @param {StockToBuyFactory} stockToBuyFactory
     * @param {StockToBuyCrudService} stockToBuyCrudService
     */
    constructor( protected toaster: ToastsManager,
                 private session: SessionService,
                 private stockToBuyStateStore: StockToBuyStateStore,
                 private stockToBuyController: StockToBuyController,
                 private stockToBuyFactory: StockToBuyFactory,
                 private stockToBuyCrudService: StockToBuyCrudService )
    {
        super( toaster,
               stockToBuyStateStore,
               stockToBuyController,
               stockToBuyFactory,
               stockToBuyCrudService );
    }
}