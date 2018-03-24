import { StockNotes } from "../../model/entity/stock-notes";
import { SessionService } from "../../service/session.service";
import { ToastsManager } from "ng2-toastr";
import { StockNotesActionTaken } from "../../common/stock-notes-action-taken.enum";
import { StockQuoteModelObjectTableComponent } from "../stock-quote/stock-quote-modelobject-table.component";
import { StockQuoteRefreshService } from "../../service/stock-quote-refresh.service";
import { BullOrBear } from "../../common/bull-or-bear.enum";
import { StockNotesStateStore } from './stock-notes-state-store';
import { StockNotesController } from './stock-notes-controller';
import { StockNotesFactory } from '../../model/factory/stock-notes.factory';
import { StockNotesCrudService } from '../../service/crud/stock-notes-crud.service';
import { TableLoadingStrategy } from '../common/table-loading-strategy';
import { StockAnalystConsensusCache } from '../../service/stock-analyst-consensus-cache';

/**
 * This is the base class for Stock Notes tables.
 *
 * Created by mike on 10/30/2016.
 */
export abstract class StockNotesTableComponent extends StockQuoteModelObjectTableComponent<StockNotes>
{
    /**
     * Constructor.
     * @param {SessionService} session
     * @param {ToastsManager} toaster
     * @param {StockNotesStateStore} stockNotesStateStore
     * @param {StockNotesController} stockNotesController
     * @param {StockNotesFactory} stockNotesFactory
     * @param {StockNotesCrudService} stockNotesCrudService
     * @param {StockQuoteRefreshService} stockQuoteRefreshService
     * @param {StockAnalystConsensusCache} stockAnalystConsensusCache
     */
    constructor( protected session: SessionService,
                 protected toaster: ToastsManager,
                 protected stockNotesStateStore: StockNotesStateStore,
                 protected stockNotesController: StockNotesController,
                 protected stockNotesFactory: StockNotesFactory,
                 protected stockNotesCrudService: StockNotesCrudService,
                 protected stockQuoteRefreshService: StockQuoteRefreshService,
                 protected stockAnalystConsensusCache: StockAnalystConsensusCache )
    {
        super( TableLoadingStrategy.LAZY_ON_CREATE,
               toaster,
               stockNotesStateStore,
               stockNotesController,
               stockNotesFactory,
               stockNotesCrudService,
               stockQuoteRefreshService,
               stockAnalystConsensusCache );
    }

    protected getActionTaken( actionTaken: string )
    {
        //this.log( 'getActionTaken: ' + actionTaken );
        return StockNotesActionTaken.getName( actionTaken );
    }

    protected getBullOrBear( bullOrBear: string )
    {
        return BullOrBear.getName( bullOrBear );
    }
}