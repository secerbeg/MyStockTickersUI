/**
 * Created by mike on 3/10/2018
 */
import { StockPosition } from '../../model/entity/stock-position';
import { ChangeDetectorRef, Component } from '@angular/core';
import { StockPositionCrudService } from '../../service/crud/stock-position-crud.service';
import { SessionService } from '../../service/session.service';
import { ToastsManager } from 'ng2-toastr';
import { CrudTableEditButtonComponent } from '../crud/table/crud-table-edit-button.component';
import { StockPositionStateStore } from '../stock-position/stock-position-state-store';
import { StockPositionController } from '../stock-position/stock-position-controller';
import { StockPositionFactory } from '../../model/factory/stock-position-factory';

@Component
({
     selector: 'stock-position-table-edit-button',
     templateUrl: '../crud/table/crud-table-button.component.html'
 })
export class StockPositionTableEditButtonComponent extends CrudTableEditButtonComponent<StockPosition>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} session
     * @param {StockPositionStateStore} stockPositionStateStore
     * @param {StockPositionController} stockPositionController
     * @param {StockPositionFactory} stockPositionFactory
     * @param {StockPositionCrudService} stockPositionCrudService
     */
    constructor( protected changeDetector: ChangeDetectorRef,
                 protected toaster: ToastsManager,
                 private session: SessionService,
                 private stockPositionStateStore: StockPositionStateStore,
                 private stockPositionController: StockPositionController,
                 private stockPositionFactory: StockPositionFactory,
                 private stockPositionCrudService: StockPositionCrudService )
    {
        super( changeDetector,
               toaster,
               stockPositionStateStore,
               stockPositionController,
               stockPositionFactory,
               stockPositionCrudService );
    }
}
