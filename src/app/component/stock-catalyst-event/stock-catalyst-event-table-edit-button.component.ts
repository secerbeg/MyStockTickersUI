/**
 * Created by mike on 3/10/2018
 */
import { StockCatalystEvent } from '../../model/entity/stock-catalyst-event';
import { Component } from '@angular/core';
import { StockCatalystEventCrudService } from '../../service/crud/stock-catalyst-event-crud.service';
import { StockCatalystEventFactory } from '../../model/factory/stock-catalyst-event.factory';
import { SessionService } from '../../service/session.service';
import { ToastsManager } from 'ng2-toastr';
import { CrudTableEditButtonComponent } from '../crud/table/crud-table-edit-button.component';
import { StockCatalystEventStateStore } from '../stock-catalyst-event/stock-catalyst-event-state-store';
import { StockCatalystEventController } from '../stock-catalyst-event/stock-catalyst-event-controller';

@Component
({
     selector: 'stock-catalyst-event-table-edit-button',
     templateUrl: '../crud/table/crud-table-button.component.html'
 })
export class StockCatalystEventTableEditButtonComponent extends CrudTableEditButtonComponent<StockCatalystEvent>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} session
     * @param {StockCatalystEventStateStore} stockNotesStateStore
     * @param {StockCatalystEventController} stockNotesController
     * @param {StockCatalystEventFactory} stockNotesFactory
     * @param {StockCatalystEventCrudService} stockNotesCrudService
     */
    constructor( protected toaster: ToastsManager,
                 private session: SessionService,
                 private stockNotesStateStore: StockCatalystEventStateStore,
                 private stockNotesController: StockCatalystEventController,
                 private stockNotesFactory: StockCatalystEventFactory,
                 private stockNotesCrudService: StockCatalystEventCrudService )
    {
        super( toaster,
               stockNotesStateStore,
               stockNotesController,
               stockNotesFactory,
               stockNotesCrudService );
    }
}