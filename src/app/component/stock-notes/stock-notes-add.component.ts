import { BaseComponent } from '../common/base.component';
import { AfterViewInit, Component } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { StockNotesController } from './stock-notes-controller';
import { StockNotesCrudActionHandler } from './stock-notes-crud-action-handler';
import { StockNotesCrudService } from '../../service/crud/stock-notes-crud.service';
import { StockToBuyController } from '../stock-to-buy/stock-to-buy-controller';
import { StockToBuyCrudActionHandler } from '../stock-to-buy/stock-to-buy-action-handler';
import { StockToBuyCrudService } from '../../service/crud/stock-to-buy-crud.service';

/**
 * Component to display the stock notes dialog to create a new note.
 */
@Component
({
    template: `<stock-notes-dialog [modal]="false"
                                   [showContinuousAddButton]="true"
                                   [showAddButton]="false"
                                   [displayDialog]="true"
                                   [showCloseButton]="false">
               </stock-notes-dialog>
    `
 })
export class StockNotesAddComponent extends BaseComponent implements AfterViewInit
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {StockNotesController} stockNotesController
     * @param {StockNotesCrudActionHandler} stockNotesActionHandler
     * @param {StockNotesCrudService} stockNotesCrudService
     * @param {StockToBuyController} stockToBuyController
     * @param {StockToBuyCrudActionHandler} stockToBuyActionHandler
     * @param {StockToBuyCrudService} stockToBuyCrudService
     */
    public constructor( protected toaster: ToastsManager,
                        private stockNotesController: StockNotesController,
                        private stockNotesActionHandler: StockNotesCrudActionHandler,
                        private stockNotesCrudService: StockNotesCrudService,
                        private stockToBuyController: StockToBuyController,
                        private stockToBuyActionHandler: StockToBuyCrudActionHandler,
                        private stockToBuyCrudService: StockToBuyCrudService )
    {
        super( toaster );
    }

    public ngAfterViewInit(): void
    {
        const methodName = 'ngAfterViewInit';
        this.logMethodBegin( methodName )
        this.stockNotesController
            .sendTableAddButtonClickedEvent();
        this.logMethodEnd( methodName )
    }
}
