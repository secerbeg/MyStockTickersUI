import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { StockCompany } from '../../model/entity/stock-company';
import { StockSearchComponent } from '../common/stock-search.component';
import { CrudTableLayoutBaseComponent } from '../crud/table/crud-table-layout-base.component';
import { ToastsManager } from 'ng2-toastr';
import { CookieService } from 'ngx-cookie-service';
import { CrudTableColumnSelectorDialogComponent } from '../crud/table/crud-table-column-selector-dialog.component';
import { CrudTableLayoutComponent } from '../crud/table/crud-table-layout.component';

/**
 * Component for all stock related CRUD Tables.
 */
@Component
({
    selector: 'stock-model-object-table-layout',
    templateUrl: './stock-model-object-table-layout.component.html'
 })
export class StockModelObjectTableLayoutComponent extends CrudTableLayoutBaseComponent
{
    @ViewChild(StockSearchComponent)
    protected stockSearchComponent: StockSearchComponent

    /**
     * Column customizer.
     */
    @ViewChild(CrudTableLayoutComponent)
    protected crudTableLayoutComponent: CrudTableLayoutComponent;

    @Input()
    protected displayStockSearchFilter: boolean;

    /**
     * Emitted when the user selects a stock from the filter.
     * @type {EventEmitter<StockCompany>}
     */
    @Output()
    protected stockSelected: EventEmitter<StockCompany> = new EventEmitter<StockCompany>();

    @Output()
    protected resetButtonClicked: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Emitted when the user sorts by a column.
     * @type {EventEmitter<any>}
     */
    @Output()
    protected onLazyLoadEvent: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {CookieService} cookieService
     */
    public constructor( protected toaster: ToastsManager,
                        protected cookieService: CookieService )
    {
        super( toaster,
               cookieService );
    }

    /**
     * This method will be called when the user sorts by a column.
     * @param event
     */
    protected onLazyLoad( event: any )
    {
        const methodName = 'onLazyLoad';
        this.debug( methodName + ' ' + JSON.stringify( event ));
        this.onLazyLoadEvent.emit( event );
    }

    /**
     * This method is called when the user selects a stock company to filter the table.
     * @param {StockCompany} stockCompany
     */
    protected onStockSelected( stockCompany: StockCompany )
    {
        this.stockSelected
            .emit( stockCompany );
    }

    /**
     * This method id called when the reset button is clicked on the stock company search filter.
      */
    protected onResetButtonClick()
    {
        this.resetButtonClicked
            .emit();
    }

    /**
     * This method is called when the row is selected.
     * @param modelObject
     */
    protected onRowSelect( modelObject: any ): void
    {
        const methodName = "onRowSelect";
        this.debug( methodName + " " + JSON.stringify( modelObject ));
        this.rowSelected.emit( modelObject );
    }

    /**
     * Need to provide the reference of the column customizer dialog to the base class.
     * @return {CrudTableColumnSelectorDialogComponent}
     */
    protected getCrudTableColumnSelectorDialogComponent(): CrudTableColumnSelectorDialogComponent
    {
        return this.crudTableLayoutComponent
                   .crudTableColumnSelectorDialogComponent;
    }
}
