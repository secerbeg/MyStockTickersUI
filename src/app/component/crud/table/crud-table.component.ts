/**
 * This is the base class for CRUD enabled tables.
 *
 * Created by mike on 12/8/2016.
 */

import { ModelObject } from "../../../model/entity/modelobject";
import { BaseCrudComponent } from "../common/base-crud.component";
import { OnInit } from "@angular/core";
import { ToastsManager } from "ng2-toastr";
import { CrudModelObjectEditMode } from "../common/crud-model-object-edit-mode";
import { CrudServiceContainer } from "../common/crud-service-container";
import { CrudOperation } from "../common/crud-operation";

/**
 * This is the base class for CRUD enabled tables.
 *
 * Created by mike on 12/8/2016.
 */
export abstract class CrudTableComponent<T extends ModelObject<T>> extends BaseCrudComponent<T> implements OnInit
{
    protected modelObjectEditMode: CrudModelObjectEditMode = CrudModelObjectEditMode.DIALOG;
    protected rows: Array<T> = [];
    protected totalRows: number;
    protected selectedModelObject: T;

    constructor( protected toaster: ToastsManager,
                 protected crudServiceContainer: CrudServiceContainer<T> )
    {
        super( toaster );
        if ( !this.crudServiceContainer.modelObjectFactory )
        {
            throw new Error( "modelObjectFactory argument cannot be null" );
        }
        if ( !this.crudServiceContainer.crudRestService )
        {
            throw new Error( "crudRestService argument cannot be null" );
        }
        if ( !this.crudServiceContainer.crudFormService )
        {
            throw new Error( "crudFormService argument cannot be null" );
        }
        if ( !this.crudServiceContainer.crudFormButtonsService )
        {
            throw new Error( "crudFormButtonsService argument cannot be null" );
        }
    }

    public ngOnInit()
    {
        this.subscribeToCrudFormButtonEvents();
        this.subscribeToCrudTableButtonEvents();
        this.loadTable();
    }

    /**
     * This method is called from {@code ngOnInit} and can be overridden by subclasses to load the table with the
     * model objects.
     */
    protected loadTable()
    {
    }

    /**
     * This method will subscribe to events generated by the parent {@code CrudTableComponent}
     * to the injected {@code CrudFormButtonsService}
     */
    protected subscribeToCrudFormButtonEvents()
    {
        this.crudServiceContainer
            .crudFormButtonsService
            .subscribeToSaveButtonClickedEvent(( modelObject: T ) => this.onUserModifiedModelObject( modelObject ) );
        this.crudServiceContainer
            .crudFormButtonsService
            .subscribeToAddButtonClickedEvent(( modelObject: T ) => this.onUserCreatedModelObject( modelObject ) );
        this.crudServiceContainer
            .crudFormButtonsService
            .subscribeToHandleDeleteButtonClickedEvent(( modelObject: T ) => this.onUserDeletedModelObject( modelObject ) );
    }

    /**
     * Subscribe to actions from the CRUD table buttons
     */
    protected subscribeToCrudTableButtonEvents()
    {
        this.crudServiceContainer
            .crudTableButtonsService.subscribeToAddButtonClickedEvent(( modelObject: T ) => this.showDialogToAdd( modelObject ) );
        this.crudServiceContainer
            .crudTableButtonsService.subscribeToEditButtonClickedEvent( ( modelObject: T ) => this.showDialogToEdit( modelObject ) );
        this.crudServiceContainer
            .crudTableButtonsService.subscribeToDeleteButtonClickedEvent(( modelObject: T ) => this.showDialogToDelete( modelObject ) );
    }

    /**
     * This method is called when the user clicks on the add button.
     * A dialog will be displayed to allow the user to add a new model object.
     */
    protected showDialogToAdd( modelObject: T )
    {
        this.logger.debug( "showDialogToAdd" );
        this.crudOperation = CrudOperation.CREATE;
        this.modelObject = modelObject;
        this.displayModelObject();
    }

    /**
     * This method is called when the user clicks on the Edit button or double clicks on a row in the table.
     * A dialog will be displayed to allow the user to edit the selected model object.
     * @param modelObject
     */
    protected showDialogToEdit( modelObject: T )
    {
        this.logger.debug( "showDialogToEdit" );
        this.crudOperation = CrudOperation.UPDATE;
        this.modelObject = modelObject;
        this.displayModelObject();
    }

    /**
     * This method is called when the user wants to delete a modelObject.
     * @param modelObject
     */
    protected showDialogToDelete( modelObject: T )
    {
        this.logger.debug( "showDialogToDelete" );
        this.crudOperation = CrudOperation.DELETE;
        this.modelObject = modelObject;
        this.displayModelObject();
    }

    /**
     * Base on whether the model object is displayed in a form on a panel or a dialog,
     * it will perform the necessary work to display the model object to the user.
     */
    private displayModelObject()
    {
        /*
         * Notify the panel of the changes
         * If a panel is used to display the selected contents, then notify the panel
         */
        if ( this.modelObjectEditMode == CrudModelObjectEditMode.PANEL )
        {
            this.crudServiceContainer.crudFormButtonsService.sendCrudOperationChangedEvent( this.crudOperation );
            this.crudServiceContainer.crudFormButtonsService.sendModelObjectChangedEvent( this.modelObject );
        }
        else
        {
            this.crudServiceContainer.crudDialogService.sendDisplayDialogRequestEvent( this.modelObject, this.crudOperation );
            //this.crudDialogService.sendCrudOperationChangedEvent( this.crudOperation );
            //this.crudDialogService.sendModelObjectChangedEvent( this.modelObject );
        }
    }

    /**
     * This method is called when the user has completed editing a model object.  The model object in the table
     * will be updated with the new values from {@code modelObject}.
     *
     * @param modelObject
     */
    protected onUserModifiedModelObject( modelObject: T ): void
    {
        this.logger.log( 'onUserModifiedModelObject ' + JSON.stringify( modelObject ) );
        var index = this.indexOf( modelObject );
        if ( index == -1 )
        {
            this.rows.push( modelObject );
        }
        else
        {
            this.rows[index] = modelObject;
        }
        this.setModelObject( modelObject );
    }

    /**
     * This method is called when the user has created a new model object that needs to be added to the table.
     */
    protected onUserCreatedModelObject( modelObject: T ): void
    {
        this.logger.log( 'onUserCreatedModelObject ' + JSON.stringify( modelObject ) );
        this.rows.push( modelObject );
        this.setModelObject( modelObject );
    }

    /**
     * this method is called when the user clicks on the Delete button on the stock form.
     */
    protected onUserDeletedModelObject( modelObject: T ): void
    {
        this.logger.log( 'onUserDeletedModelObject' + JSON.stringify( modelObject ) );
        var index = this.indexOf( modelObject );
        if ( index != -1 )
        {
            this.rows.splice( index,  1 );
            this.setModelObject( null );
        }
    }

    /**
     * this method is called when the user selects a row in the stock table
     * @param modelObject
     */
    protected onRowSelect( event ): void
    {
        this.logger.log( "onRowSelect " + JSON.stringify( event ) );
        /*
         * Need to save the actual data value so that the table selection persists.
         * because: this.modelObject <> this.selectedModelObject
         */
        this.selectedModelObject = event.data;
        this.setModelObject( this.crudServiceContainer.modelObjectFactory.newModelObjectFromObject( event.data ) );
        /*
         * If a panel is used to display the selected contents, then notify the panel
         */
        if ( this.modelObjectEditMode == CrudModelObjectEditMode.PANEL )
        {
            this.showDialogToEdit( this.modelObject );
        }
    }

    /**
     * This method is called when the user double clicks on a row in the table.
     * @param event
     */
    protected onRowDoubleClick( event ): void
    {
        var methodName = "onRowDoubleClick";
        this.logger.log( methodName + " " + JSON.stringify( event ) );
        this.setModelObject( this.crudServiceContainer.modelObjectFactory.newModelObjectFromObject( event.data ) );
        this.showDialogToEdit( this.modelObject );
    }

    /**
     * Determines the index of a model object in the rows array
     * @returns {number} -1 if not found
     */
    protected indexOf( targetModelObject : T ): number
    {
        if ( targetModelObject )
        {
            for ( var i = 0; i < this.rows.length; i++ )
            {
                var modelObject = this.rows[i];
                if ( targetModelObject.isEqualPrimaryKey( modelObject ) )
                {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * Set the model object and notify the buttons of the model object change.
     * @param modelObject
     * @return {undefined}
     */
    protected setModelObject( modelObject: T ): void
    {
        //super.setModelObject( this.modelObjectFactory.newModelObjectFromJSON( modelObject ));
        super.setModelObject( modelObject );
        this.crudServiceContainer
            .crudTableButtonsService
            .sendModelObjectChangedEvent( modelObject );
    }
}