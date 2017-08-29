import { CrudFormService } from "../crud/crud-form.service";
import { PortfolioStock } from "../../model/class/portfolio-stock";
import { Injectable, ApplicationRef } from "@angular/core";
import { PortfolioStockFactory } from "../../model/factory/portfolio-stock.factory";
/**
 * Created by mike on 12/14/2016.
 */
@Injectable()
export class PortfolioStockFormService extends CrudFormService<PortfolioStock>
{
    constructor( protected portfolioStockFactory: PortfolioStockFactory )
    {
        super( portfolioStockFactory );
    }
}
