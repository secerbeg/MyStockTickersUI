import { StockNotesStock } from "./stock-notes-stock";
import { StockNoteContainer } from "../../common/stock-note-container";
import { StockQuoteModelObject } from "./stock-quote-modelobject";
import { StockNotesSourceContainer } from "../../common/stock-notes-source-container";

/**
 * Defines a single portfolio for a customer
 * Created by mike on 10/23/2016.
 */
export class StockNotes extends StockQuoteModelObject<StockNotes> implements StockNoteContainer,
                                                                             StockNotesSourceContainer
{
    public id: number;
    public customerId: number;
    public notes: string;
    public notesDate: Date;
    public notesSourceName: string;
    public notesSourceId: number;
    public notesRating: number;
    public publicInd: boolean;
    public bullOrBear: number;
    public actionTaken: number;
    public actionTakenShares: number;
    public actionTakenPrice: number;
    public tags: string[];
    public stocks: Array<StockNotesStock>;

    /**
     * Get the notes
     * @returns {string}
     */
    public getNotes(): string
    {
        return this.notes;
    }

    /**
     * Returns a comma delimeted string of the ticker symbols
     * @return {string}
     */
    public getTickerSymbols(): string
    {
        let tickerSymbols: string = '';
        this.stocks
            .forEach( stockNotesStock =>
                      {
                          if ( tickerSymbols.length > 0 )
                          {
                              tickerSymbols += ', ';
                          }
                          tickerSymbols += stockNotesStock.tickerSymbol;
                      } );
        return tickerSymbols;
    }

    public getNotesSourceId(): number
    {
        return this.notesSourceId;
    }

    public setNotesSourceId( notesSourceId: number )
    {
        this.notesSourceId = notesSourceId;
    }

    public getNotesSourceName(): string
    {
        return this.notesSourceName;
    }

    public setNotesSourceName( notesSourceName: string )
    {
        this.notesSourceName = notesSourceName;
    }

    public getPrimaryKeyValue(): any
    {
        return this.id;
    }

    public getPrimaryKeyName(): string
    {
        return "id";
    }
}
