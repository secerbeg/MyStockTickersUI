import { ModelObject } from "./modelobject";
/**
 * This class defines the fields and methods for a single Stock
 * Created by mike on 9/12/2016.
 */
export class Stock extends ModelObject<Stock>
{
    public static readonly TICKER_SYMBOL_LEN = 10;
    public tickerSymbol: string;
    public companyName: string;
    public lastPrice: number;
    public exchange: string;
    public createdBy: number;
    public userEntered: boolean;

    /**
     * Determines if the stock was entered by a user. Otherwise, it was download from a stock exchange source.
     * @returns false if the stock was entered by a user, otherwise true as it was information
     *          downloaded from a data feed
     */
    public isUserEntered(): boolean
    {
        return this.userEntered;
    }

    public isEqualPrimaryKey( modelObject: Stock )
    {
        var isEqual = false;
        if ( modelObject )
        {
            isEqual = this.tickerSymbol === modelObject.tickerSymbol;
        }
        return isEqual;
    }
}
