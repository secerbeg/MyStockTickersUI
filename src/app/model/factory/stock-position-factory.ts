import { ModelObjectFactory } from "./model-object.factory";
import { Injectable } from "@angular/core";
import { SessionService } from "../../service/session.service";
import { StockPosition } from '../entity/stock-position';

/**
 * This class provides StockPosition factory methods.
 *
 * Created by mike on 12/4/2017.
 */
@Injectable()
export class StockPositionFactory extends ModelObjectFactory<StockPosition>
{
    constructor( protected session: SessionService )
    {
        super();
    }

    /**
     * Create a new StockPosition instance
     * @returns {StockPosition}
     */
    public newModelObject(): StockPosition
    {
        var position = new StockPosition();
        position.customerId = this.session.getLoggedInUserId();
        position.id = '';
        position.tradeItAccountId = '';
        position.linkedAccountId = '';
        position.tickerSymbol = "";
        position.symbolClass = "";
        position.costBasis = 0;
        position.holdingType = "";
        position.quantity = 0;
        position.todayGainLossAbsolute = 0;
        position.todayGainLossPercentage = 0;
        position.totalGainLossAbsolute = 0;
        position.totalGainLossPercentage = 0;
        position.exchange = "";
        position.version = 0;
        return position;
    }

}
