import { ModelObjectFactory } from "./model-object.factory";
import { Injectable } from "@angular/core";
import { StockNoteCount } from "../class/stock-note-count";

/**
 * This is the StockNoteCount model object factory
 * Created by mike on 12/13/2016.
 */
@Injectable()
export class StockNoteCountFactory extends ModelObjectFactory<StockNoteCount>
{
    /**
     * Create a new StockNoteCount instance
     * @returns {StockNoteCount}
     */
    newModelObject(): StockNoteCount
    {
        var stockNoteCount = new StockNoteCount();
        stockNoteCount.noteCount = 0;
        stockNoteCount.customerId = 0;
        stockNoteCount.tickerSymbol = '';
        return stockNoteCount;
    }
}