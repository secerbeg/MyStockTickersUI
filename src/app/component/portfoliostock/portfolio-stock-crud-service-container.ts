import { Injectable } from "@angular/core";
import { CrudServiceContainer } from "../crud/common/crud-service-container";
import { PortfolioStock } from "../../model/entity/portfolio-stock";
import { PortfolioStockFactory } from "../../model/factory/portfolio-stock.factory";
import { PortfolioStockCrudService } from "../../service/crud/portfolio-stock-crud.service";
import { ModelObjectChangeService } from "../../service/crud/model-object-change.service";

/**
 * This is the CRUD Service class for PortfolioStock model objects
 */
@Injectable()
export class PortfolioStockCrudServiceContainer extends CrudServiceContainer<PortfolioStock>
{
    constructor( private _portfolioStockFactory: PortfolioStockFactory,
                 private _portfolioStockCrudService: PortfolioStockCrudService )
    {
        super( new ModelObjectChangeService<PortfolioStock>(), _portfolioStockFactory, _portfolioStockCrudService )
    }

    get portfolioStockFactory(): PortfolioStockFactory { return this._portfolioStockFactory; }

    set portfolioStockFactory( value: PortfolioStockFactory ) { this._portfolioStockFactory = value; }

    get portfolioStockCrudService(): PortfolioStockCrudService { return this._portfolioStockCrudService; }

    set portfolioStockCrudService( value: PortfolioStockCrudService ) { this._portfolioStockCrudService = value; }

}
