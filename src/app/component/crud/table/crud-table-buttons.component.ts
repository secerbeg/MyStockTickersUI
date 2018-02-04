import { ToastsManager } from "ng2-toastr";
import { Component } from "@angular/core";
import { ModelObject } from "../../../model/entity/modelobject";
import { BaseCrudComponent } from "../common/base-crud.component";
import { isNullOrUndefined } from "util";
import { CrudOperation } from "../common/crud-operation";
import { CrudStateStore } from '../common/crud-state-store';
import { ModelObjectFactory } from '../../../model/factory/model-object.factory';
import { CrudController } from '../common/crud-controller';

/**
 * This is the base component class for the buttons on all CRUD enabled tables
 *
 * Created by mike on 1/2/2017.
 */
@Component({
               selector:    'crud-table-buttons',
               styleUrls:   ['./crud-table-buttons.component.css'],
               templateUrl: './crud-table-buttons.component.html'
           })
export abstract class CrudTableButtonsComponent<T extends ModelObject<T>> extends BaseCrudComponent<T>
{
    private selectedModelObject: T;

    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {CrudStateStore<T extends ModelObject<T>>} crudStateStore
     * @param {CrudController<T extends ModelObject<T>>} crudController
     * @param {ModelObjectFactory<T extends ModelObject<T>>} modelObjectFactory
     */
    constructor( protected toaster: ToastsManager,
                 protected crudStateStore: CrudStateStore<T>,
                 protected crudController: CrudController<T>,
                 protected modelObjectFactory: ModelObjectFactory<T> )
    {
        super( toaster, crudStateStore, crudController, modelObjectFactory );
        this.subscribeToCrudTableEvents()
    }

    /**
     * Subscribe to table row selection events
     */
    private subscribeToCrudTableEvents()
    {
        this.debug( "subscribeToCrudTableEvents" );
        /*
         * We need to know when the table selections change so that we can enable/disable buttons
         */
        this.crudController
            .subscribeToTableSelectionChangeEvent( ( modelObject: T ) =>
                                                   {
                                                       this.handleTableSelectionChangeEvent( modelObject );
                                                   });

    }

    /**
     * This method is called when the number of model objects that were selected changes.
     * @param {[T]} modelObjects
     */
    private handleTableSelectionChangeEvent( modelObject: T )
    {
        this.debug( "handleTableSelectionChangeEvent modelObject: " + JSON.stringify( modelObject ));
        this.selectedModelObject = modelObject;
    }

    /**
     * Returns the default Refresh button label
     * @return {string}
     */
    protected getRefreshButtonLabel(): string
    {
        return "Refresh";
    }

    /**
     * Determines if the Refresh button should be shown.
     * @return {boolean} true by default
     */
    protected isShowRefreshButton(): boolean
    {
        return true;
    }

    /**
     * Determines if the Refresh button should be disabled.
     * It should be disabled when no portfolio is selected
     * @returns {boolean}
     */
    protected isRefreshButtonDisabled(): boolean
    {
        return false;
    }

    /**
     * Returns the default Add button label
     * @return {string}
     */
    protected getAddButtonLabel(): string
    {
        return "Add";
    }

    /**
     * Determines if the add button should be shown.
     * @return {boolean} true by default
     */
    protected isShowAddButton(): boolean
    {
        return true;
    }

    /**
     * Determines if the Add button should be disabled.
     * It should be disabled when no portfolio is selected
     * @returns {boolean}
     */
    protected isAddButtonDisabled(): boolean
    {
        return false;
    }

    /**
     * Returns the default Delete button label
     * @return {string}
     */
    protected getDeleteButtonLabel(): string
    {
        return "Delete";
    }

    /**
     * Determines if the add button should be shown.
     * @return {boolean} true by default
     */
    protected isShowDeleteButton(): boolean
    {
        return true;
    }

    /**
     * Determines if the Delete button should be disabled.
     * It should be disabled when no portfolio is selected
     * @returns {boolean}
     */
    protected isDeleteButtonDisabled(): boolean
    {
        return isNullOrUndefined( this.selectedModelObject );
    }

    /**
     * This method is called when the Add button is clicked.
     * It will notify the button service that the button was clicked.
     */
    protected onAddButtonClick(): void
    {
        this.debug( "onAddButtonClick " );
        var modelObject = this.modelObjectFactory.newModelObject();
        this.crudStateStore
            .sendModelObjectChangedEvent( this, modelObject );
        this.crudStateStore
            .sendCrudOperationChangedEvent( CrudOperation.CREATE );
        /*
        this.crudServiceContainer
            .crudTableButtonsService
            .sendAddButtonClickedEvent( modelObject );
            */
    }

    /**
     * This method is called when the Delete button is clicked.
     * It will notify the button service that the button was clicked.
     */
    protected onDeleteButtonClick(): void
    {
        this.debug( "onDeleteButtonClick " + JSON.stringify( this.modelObject ));
        this.crudStateStore
            .sendModelObjectChangedEvent( this, this.modelObject );
        this.crudStateStore
            .sendCrudOperationChangedEvent( CrudOperation.DELETE );
        /*
        if ( !isNullOrUndefined( this.modelObject ) )
        {
            this.crudServiceContainer
                .crudTableButtonsService.sendDeleteButtonClickedEvent( this.modelObject );
        }
        */
    }

    /**
     * This method is called when the Refresh button is clicked.
     * It will notify the button service that the button was clicked.
     */
    protected onRefreshButtonClick(): void
    {
        this.debug( "onRefreshButtonClick " );
        this.crudController
            .sendRefreshButtonClickedEvent();
    }

    /**
     * Defines the CSS class for the Add button
     * @return {string}
     */
    protected getAddButtonClass(): string
    {
        return "crud-table-button";
    }

    /**
     * Defines the CSS class for the Delete button
     * @return {string}
     */
    protected getDeleteButtonClass(): string
    {
        return "crud-table-button";
    }

    /**
     * Defines the CSS class for the Delete button
     * @return {string}
     */
    protected getRefreshButtonClass(): string
    {
        return "crud-table-button";
    }

    /**
     * Defines the icon to be used for the Add button
     * @return {string} defaults to fa-plus
     */
    protected getAddButtonIcon(): string
    {
        return "fa-plus";
    }

    /**
     * Defines the icon to be used for the Delete button
     * @return {string} defaults to fa-trash
     */
    protected getDeleteButtonIcon(): string
    {
        return "fa-trash";
    }

    /**
     * Defines the icon to be used for the Refresh button
     * @return {string} defaults to fa-trash
     */
    protected getRefreshButtonIcon(): string
    {
        return "fa-refresh";
    }
}
