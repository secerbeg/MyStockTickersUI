import { Stock } from "../../model/class/stock";
import { CrudFormButtonsService } from "../crud/crud-form-buttons.service";
import { StockFactory } from "../../model/factory/stock.factory";
import { Injectable } from "@angular/core";

/**
 * Created by mike on 12/17/2016.
 */
@Injectable()
export class StockFormButtonsService extends CrudFormButtonsService<Stock>
{
    constructor( protected stockFactory: StockFactory )
    {
        super( stockFactory );
    }
}
