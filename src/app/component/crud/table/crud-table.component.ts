/**
 * This is the base class for CRUD enabled tables.
 *
 * Created by mike on 12/8/2016.
 */

import { ModelObject } from "../../../model/common/model-object";
import { BaseCrudComponent } from "../common/base-crud.component";
import { OnInit, ViewChild } from "@angular/core";
import { ToastsManager } from "ng2-toastr";
import { isNullOrUndefined } from "util";
import { ModelObjectChangedEvent } from "../../../service/crud/model-object-changed.event";
import { DataTable, LazyLoadEvent } from "primeng/primeng";
import { PaginationPage } from "../../../common/pagination";
import { TableLoadingStrategy } from "../../common/table-loading-strategy";
import { CrudStateStore } from '../common/crud-state-store';
import { CrudController } from '../common/crud-controller';
import { ModelObjectFactory } from '../../../model/factory/model-object.factory';
import { CrudRestService } from '../../../service/crud/crud-rest.serivce';
import { Observable } from 'rxjs/Rx';
import { CrudTableColumns } from './crud-table-columns';
import { CrudTableColumnType } from './crud-table-column-type';
import { CrudTableColumnCachedDataType } from './crud-table-column-cached-data-type';
import { CrudTableColumnSelectorDialogComponent } from './crud-table-column-selector-dialog.component';


/**
 * This is the base class for CRUD enabled tables.
 * <T> Defines the model object that is displayed within the table.
 *
 * Created by mike on 12/8/2016.
 */
export abstract class CrudTableComponent<T extends ModelObject<T>> extends BaseCrudComponent<T> implements OnInit
{
    /**
     * Enum reference variable.
     */
    protected CrudTableColumnCachedDataType = CrudTableColumnCachedDataType;
    /**
     * Enum reference variable.
     * @type {CrudTableColumnType}
     */
    protected CrudTableColumnType = CrudTableColumnType;
    /**
     * The list of model objects displayed.
     * @type {Array}
     */
    protected rows: Array<T> = [];
    /**
     * totalRows is used to tell the paginator how many total rows are in the database so that it can accurately display
     * the page selection list and other pagination information.
     */
    protected totalRows: number;
    /**
     * This is a reference to the object in the table that is selected.  It is not the same object as the model object
     * and this variable must be separate from this.modelObject.
     */
    protected selectedModelObject: T;
    /**
     * This is true when the table is loading and false otherwise.
     * @type {boolean}
     */
    protected loading: boolean = false;
    /**
     * The last page load event
     */
    protected lastLoadEvent: LazyLoadEvent;

    /**
     * The table :-)
     */
    @ViewChild(DataTable)
    protected dataTable: DataTable;

    /**
     * Column customizer.
     */
    @ViewChild(CrudTableColumnSelectorDialogComponent)
    protected crudTableColumnSelectorDialogComponent: CrudTableColumnSelectorDialogComponent;

    /**
     * These are the columns to be sent to the turbo table.  They are defined as <any> because we are going to send it
     * our columns of type CrudTableColumn.
     * @type {any[]}
     */
    protected columns: any[] = [];

    /**
     * Column definitions for the columns that are selected/displayed.
     * @type {any[]}
     */
    protected selectedColumns: CrudTableColumns = new CrudTableColumns( [] );

    /**
     * Column definitions for columns that have not been selected to be displayed and thus are available.
     * @type {CrudTableColumns}
     */
    protected availableColumns: CrudTableColumns = new CrudTableColumns( [] );

    /**
     * Column definitions for all columns.
     * @type {CrudTableColumns}
     */
    //protected allColumns: CrudTableColumns = new CrudTableColumns( [] );

    /**
     * Constructor.
     * @param {TableLoadingStrategy} tableLoadingStrategy
     * @param {ToastsManager} toaster
     * @param {CrudStateStore<T extends ModelObject<T>>} crudStateStore
     * @param {CrudController<T extends ModelObject<T>>} crudController
     * @param {ModelObjectFactory<T extends ModelObject<T>>} modelObjectFactory
     * @param {CrudRestService<T extends ModelObject<T>>} crudRestService
     */
    protected constructor( protected tableLoadingStrategy: TableLoadingStrategy,
                           protected toaster: ToastsManager,
                           protected crudStateStore: CrudStateStore<T>,
                           protected crudController: CrudController<T>,
                           protected modelObjectFactory: ModelObjectFactory<T>,
                           protected crudRestService: CrudRestService<T> )
    {
        super( toaster,
               crudStateStore,
               crudController,
               modelObjectFactory,
               crudRestService );
        this.debug( "Constructor tableLoadingStrategy: " + TableLoadingStrategy.getName( this.tableLoadingStrategy ));
    }

    /**
     * Initialize the table, subscribe to form and button events, and call the loadTable method
     */
    public ngOnInit()
    {
        this.debug( "ngOnInit.begin" );
        super.ngOnInit();
        this.subscribeToServiceEvents();
        this.loadColumns();
        if ( TableLoadingStrategy.isLoadOnCreate( this.tableLoadingStrategy ))
        {
            this.loading = true;
            this.loadTable();
        }
    }

    /**
     * View init completed.
     */
    public ngAfterViewInit()
    {
        super.ngAfterViewInit();
        /*
         * Subscribe to the OK button being clicked to customize the column layout.
         */
        this.addSubscription( 'columnsCustomizedEvent',
                              this.crudTableColumnSelectorDialogComponent
                                  .subscribeToOkButtonClicked( ()=> this.columnsCustomized() ));

    }

    /**
     * Load all of the columns for type table.  This is based on the type of model object.
     */
    protected loadColumns(): void
    {
        let modelObject: ModelObject<T> = this.modelObjectFactory
                                              .newModelObject();
        let crudTableColumns: CrudTableColumns = modelObject.getCrudTableColumns();
        if ( !isNullOrUndefined( crudTableColumns ) )
        {
            this.selectedColumns.addAll( modelObject.getCrudTableColumns() )
            this.availableColumns.addAll( modelObject.getOtherCrudTableColumns() );
            this.columns = this.selectedColumns
                               .toArray();
        }
    }

    /**
     * Determines if lazy loading is enabled.
     * @returns {boolean}
     */
    protected isLazyLoading(): boolean
    {
        return TableLoadingStrategy.isLazyLoading( this.tableLoadingStrategy );
    }

    /**
     * Subscribes to the necessary service events.
     */
    protected subscribeToServiceEvents()
    {
        const methodName = "subscribeToServiceEvents";
        this.debug( methodName + ".begin" );
        this.subscribeToCrudTableButtonEvents();
        this.debug( methodName + ".end" );
    }

    /**
     * This event is triggered by the DataTable containing the stocks to request the load of a new page of stocks
     * @param event
     */
    protected lazyLoadTable( event: LazyLoadEvent ): void
    {
        const methodName = "lazyLoadTable";
        this.debug( methodName + '.begin ' + JSON.stringify( event ) );
        this.crudRestService
            .getPage( this.modelObject, event )
            .catch( error =>
                    {
                        this.showError( error );
                        return Observable.throw( error );
                    })
            .subscribe( page =>
                        {
                            this.loading = false;
                            this.onPageLoad( page );
                            this.debug( methodName + '.end');
                        },
                        err =>
                        {
                            this.loading = false;
                            this.logError( err );
                            this.debug( methodName + '.end');
                        } );
        this.lastLoadEvent = event;
    }

    /**
     * A new stock page has been received
     * @param stocksPage
     */
    protected onPageLoad( page: PaginationPage<T> ): void
    {
        this.debug( "onPageLoad.begin totalElements: " + page.totalElements +
                    " totalPages: " + page.totalPages );
        this.totalRows = page.totalElements;
        var rows: T[] = this.modelObjectFactory
                            .newModelObjectArray( page.content );
        this.onTableLoad( rows );
        this.debug( 'onPageLoad.end: totalElements: ' + this.rows.length );
    }

    /**
     * This method is called when the refresh button is clicked.
     * By default, it simply calls the {@code loadTable} method.
     */
    public refreshTable(): void
    {
        this.debug( "refreshTable.begin" );
        /*
         * Need to clear out any values for the model object or the table might be filtered based on its contents
         */
        this.crudStateStore.sendModelObjectChangedEvent( this, this.modelObjectFactory.newModelObject() );
        this.selectedModelObject = null;
        if ( this.isLazyLoading() )
        {
            this.lazyLoadTable( this.lastLoadEvent );
        }
        else
        {
            this.loadTable();
        }
        this.crudController
            .sendTableSelectionChangeEvent( this.selectedModelObject );
        this.debug( "refreshTable.end" );
    }

    protected getRowsPerPage(): number
    {
        return 20;
    }

    /**
     * This method is called from {@code ngOnInit} and can be overridden by subclasses to load the table with the
     * model objects.
     */
    protected loadTable(): void
    {
        this.debug( "loadTable.begin" );
        if ( this.isLazyLoading() )
        {
            this.debug( "loadTable lazyLoading=true" );
            this.lazyLoadTable( this.lastLoadEvent );
        }
        else
        {
            this.loading = true;
            this.crudRestService
                .getModelObjectList( this.modelObject )
                .catch( error =>
                        {
                            this.showError( error );
                            return Observable.throw( error );
                        })
                .subscribe( ( modelObjects: T[] ) =>
                            {
                                this.loading = false;
                                this.onTableLoad( modelObjects );
                                this.debug( "loadTable.end" );
                            });

        }
    }

    /**
     * This method is called after the modelObjects have been retrieved from the database
     * @param {T[]} modelObjects
     */
    protected onTableLoad( modelObjects: T[] ): void
    {
        const methodName = "onTableLoad";
        this.debug( "onTableLoad.begin" );
        if ( !isNullOrUndefined( modelObjects ) && modelObjects.length > 0 )
        {
            this.rows = modelObjects;
            this.debug( methodName + " loaded " + this.rows.length + " rows" );
        }
        else
        {
            this.rows = [];
            this.debug( methodName + " loaded 0 rows" );
        }
        this.debug( methodName + ".end" );
    }

    /**
     * Subscribe to actions from the CRUD table buttons
     */
    protected subscribeToCrudTableButtonEvents(): void
    {
        const methodName = 'subscribeToCrudTableButtonEvents';
        this.debug( methodName + '.begin' );
        if ( this.isAllowAdds() )
        {
            this.addSubscription( 'subscribeToAddButtonClickedEvent',
                this.crudController
                    .subscribeToTableAddButtonClickedEvent( () => this.showFormToAdd() ) );
        }
        if ( this.isAllowUpdates() )
        {
            this.addSubscription( 'subscribeToEditButtonClickedEvent',
                this.crudController
                    .subscribeToTableEditButtonClickedEvent( () => this.showFormToEdit() ) );
        }
        if ( this.isAllowDeletes() )
        {
            this.addSubscription( 'subscribeToDeleteButtonClickedEvent',
                this.crudController
                    .subscribeToTableDeleteButtonClickedEvent( () => this.showFormToDelete() ) );
        }
        /*
         * Subscribe to refresh button click
         */
        this.addSubscription( 'subscribeToRefreshButtonClickedEvent',
            this.crudController
                .subscribeToRefreshButtonClickedEvent( () => this.refreshTable() ) );
        /*
         * Subscribe to customize button click
         */
        this.addSubscription( 'subscribeToCustomizeButtonClickedEvent',
                              this.crudController
                                  .subscribeToCustomizeButtonClickedEvent( () => this.customizeColumns() ) );
        this.debug( methodName + '.end' );
    }

    /**
     * This method is called when the user clicks on the customize table button.
     */
    protected customizeColumns(): void
    {
        const methodName = 'customizeColumns';
        this.log( methodName );
        this.crudTableColumnSelectorDialogComponent
            .selectedColumns = this.selectedColumns.toColumnArray();
        this.crudTableColumnSelectorDialogComponent
            .availableColumns = this.availableColumns.toColumnArray();
        this.crudTableColumnSelectorDialogComponent
            .displayDialog = true;
    }

    /**
     * This method is called when the use has clicked the ok button on the customize column dialog.
     */
    protected columnsCustomized(): void
    {
        const methodName = 'columnsCustomized';
        this.log( methodName + ' selectedColumns ' + JSON.stringify( this.crudTableColumnSelectorDialogComponent
                                                         .selectedColumns ));
        this.log( methodName + ' availableColumns ' + JSON.stringify( this.crudTableColumnSelectorDialogComponent
                                                                          .availableColumns ));
        this.selectedColumns = new CrudTableColumns( this.crudTableColumnSelectorDialogComponent
                                                         .selectedColumns );
        this.availableColumns = new CrudTableColumns( this.crudTableColumnSelectorDialogComponent
                                                          .availableColumns );
        this.columns = this.selectedColumns
                           .toArray();
    }

    /**
     * Creates a new model object by calling the model object factory to create the model object.
     * This method is called when the user has clicked the add button.
     * @return {T}
     */
    protected newModelObject(): T
    {
        return this.modelObjectFactory.newModelObject();
    }

    /**
     * This method is called when the user clicks on the add button.
     * A dialog will be displayed to allow the user to add a new model object.
     */
    protected showFormToAdd(): void
    {
        this.debug( "showFormToAdd" );
        this.displayModelObject();
    }

    /**
     * This method is called when the user clicks on the Edit button or double clicks on a row in the table.
     * A dialog will be displayed to allow the user to edit the selected model object.
     * @param modelObject
     */
    protected showFormToEdit(): void
    {
        this.debug( "showFormToEdit " + JSON.stringify( this.modelObject ) );
        if ( !isNullOrUndefined( this.modelObject ) )
        {
            this.debug( "showFormToEdit" );
            this.displayModelObject();
        }
    }

    /**
     * This method is called when the user wants to delete a modelObject.
     * @param modelObject
     */
    protected showFormToDelete(): void
    {
        this.debug( "showFormToDelete " + JSON.stringify( this.modelObject ) );
        if ( !isNullOrUndefined( this.modelObject ) )
        {
            this.debug( "showFormToDelete" );
            this.displayModelObject();
        }
    }

    /**
     * Base on whether the model object is displayed in a form on a panel or a dialog,
     * it will perform the necessary work to display the model object to the user.
     */
    protected displayModelObject(): void
    {
        this.debug( "displayModelObject: " + JSON.stringify( this.modelObject ) );
        /*
         * if the user is modifying the model object, we need to check that they have the latest version of the data.
         */
        if ( this.isCrudUpdateOperation() )
        {
            this.checkModelObjectVersion();
        }
        else
        {
            /*
            this.crudController
                .sendDisplayFormRequestEvent();
                */
        }
    }


    /**
     * The model object has been saved so update the table.
     * @param {T} modelObject
     */
    protected onModelObjectSaved( modelObject: T )
    {
        var methodName = "onModelObjectSaved";
        this.debug( methodName + ".begin" );
        this.selectedModelObject = modelObject;
        this.modelObject = modelObject;
        this.updateModelObjectInTable( this.modelObject, true );
        this.crudController
            .sendTableContentChangeEvent();
        this.debug( methodName + ".end" );
    }

    /**
     * This method will find the model object in the table and update it contents of the model if found.
     * @param {T} modelObject
     * @param {boolean} addIfNotFound When true, if the model object is not found in the table it will be added to the
     *        table.
     */
    protected updateModelObjectInTable( modelObject: T, addIfNotFound: boolean )
    {
        const methodName = "updateModelObjectInTable";
        this.debug( methodName + ".begin " + JSON.stringify( modelObject ) + " " + addIfNotFound );
        this.modelObject = modelObject;
        var index = this.indexOf( this.modelObject );
        if ( index == -1 )
        {
            if ( addIfNotFound )
            {
                this.addModelObjectToTable( this.modelObject );
            }
        }
        else
        {
            this.updateModelObjectTableRow( index, this.modelObject );
        }
        this.debug( methodName + ".end" );
    }

    /**
     * Adds rows to the table
     * @param {T[]} newRows
     */
    protected addRows( newRows: T[] ): void
    {
        this.debug( "addRows" );
        this.rows = [...newRows, ...this.rows];
    }

    /**
     * Add the model object to the table.
     * @param {T} modelObject
     */
    protected onModelObjectCreated( modelObject: T )
    {
        var methodName = "onModelObjectCreated";
        this.debug( methodName + ".begin" );
        super.onModelObjectCreated( modelObject );
        this.addModelObjectToTable( modelObject );
        this.debug( methodName + ".end" );
    }

    /**
     * This method is called when a modelObject of type T is changed.  This method will determine if the event is
     * from itself or another component and if so, make any necessary changes.
     * @param {ModelObjectChangedEvent<T extends ModelObject<T>>} modelObjectChangeEvent
     */
    protected onModelObjectChangedEvent( modelObjectChangeEvent: ModelObjectChangedEvent<T> )
    {
        var methodName = "onModelObjectChangedEvent";
        this.debug( methodName + ".begin modelObject: " + JSON.stringify( modelObjectChangeEvent.modelObject ) );
        this.debug( methodName + " sender: " + (<any>modelObjectChangeEvent.sender).constructor.name );
        this.updateModelObjectInTable( modelObjectChangeEvent.modelObject, false );
        this.debug( methodName + ".end" );
    }

    /**
     * This method is called when a model object is added to the table.  This happens when a user adds a new
     * entry to the table.
     * @param {T} modelObject The model object to be added to the table.
     */
    protected addModelObjectToTable( modelObject: T ): void
    {
        this.debug( "addModelObjectToTable " + JSON.stringify( modelObject ) );
        /*
         * A new array must be created to trigger a change event
         */
        this.rows = [modelObject, ...this.rows];
        this.modelObject = modelObject;
    }

    /**
     * Updates the model object in the table.  This method calles {@code updateModelObjectTableRow( index, modelObject )}
     * after determining the row of the model object.
     * @param {T} modelObject
     * @param {Error} errorBack is a callback function that will be called when the model object cannot be found in table
     */
    protected updateModelObjectRow( modelObject: T, errorBack?: ( Error ) => any )
    {
        this.debug( 'updateModelObjectTableRow' + JSON.stringify( modelObject ) );
        let rowIndex = this.indexOf( modelObject );
        if ( rowIndex == -1 )
        {
            errorBack(
                new RangeError( "row was not found for model object key: " + JSON.stringify( modelObject ) ) );
        }
        else
        {
            this.updateModelObjectTableRow( rowIndex, modelObject );
        }
    }

    /**
     * This method is called when a user updates the model object and the table needs to be updated to reflect the
     * user's changes.
     * @param {number} rowIndex
     * @param {T} modelObject
     */
    protected updateModelObjectTableRow( rowIndex: number, modelObject: T ): void
    {
        this.debug( 'updateModelObjectTableRow index: ' + rowIndex + " " + JSON.stringify( modelObject ) );
        this.rows[rowIndex] = modelObject;
        /*
         * A new array must be created to trigger a change event
         */
        this.rows = [...this.rows]
    }

    /**
     * Remove the model object from the table.
     * @param {T} modelObject
     */
    protected onModelObjectDeleted( modelObject: T )
    {
        var methodName = "onModelObjectDeleted";
        this.debug( methodName + ".begin " + JSON.stringify( modelObject ) );
        this.removeModelObjectFromTable( modelObject );
        this.crudController
            .sendTableContentChangeEvent();
        this.debug( methodName + ".end" );
    }

    /**
     * This method removes the modelObject from the table if it is found
     * @param {T} modelObject
     * @return true if the modelObject was found and removed.  returns false otherwise.
     */
    protected removeModelObjectFromTable( modelObject: T ): boolean
    {
        this.debug( "removeModelObjectFromTable " + JSON.stringify( modelObject ) );
        var index = this.indexOf( modelObject );
        if ( index == -1 )
        {
            return false;
        }
        else
        {
            /*
             * A new array must be created to trigger a change event
             */
            this.rows = this.rows.slice( index + 1 ).concat( this.rows.slice( 0, index ) );
            //this.setModelObject( null );
            return true;
        }
    }

    /**
     * this method is called when the user selects a row in the stock table
     * @param modelObject
     */
    protected onRowSelect( event ): void
    {
        const methodName = "onRowSelect";
        this.debug( methodName +  ".begin " + JSON.stringify( event ) );
        this.selectedModelObject = this.createModelObjectFromRowSelectionEvent( event );
        var index = this.indexOf( this.selectedModelObject );
        if ( index >= 0 )
        {
            let modelObject: T = this.rows[index];
            this.onModelObjectSelected( modelObject );
        }
        else
        {
            this.logError( "Could not find mode object int rows array" );
        }
        this.debug( methodName +  ".end" );
    }

    /**
     * Creates a model object from a row selection event.
     * @param event
     * @return {T}
     */
    protected createModelObjectFromRowSelectionEvent( event ): T
    {
        let modelObject: T = null;
        if ( event.data )
        {
            modelObject = this.modelObjectFactory
                              .newModelObjectFromJSON( event.data );
        }
        else
        {
            modelObject = this.modelObjectFactory
                              .newModelObjectFromJSON( event );
        }
        return modelObject;
    }

    /**
     * This method sends a model object change event and a table selection change event containing the model object.
     * @param {T} modelObject
     */
    protected onModelObjectSelected( modelObject: T )
    {
        const methodName = "onModelObjectSelected";
        this.debug( methodName + ".begin " + JSON.stringify( modelObject ) );
        this.modelObject = modelObject;
        /*
         * must forward change to controller so that it's propagated.
         */
        this.crudStateStore
            .sendModelObjectChangedEvent( this, modelObject );
        this.crudController
            .sendTableSelectionChangeEvent( modelObject );
        this.debug( methodName + ".end " );
    }

    /**
     * This method is called when the user un-selects a row.
     * It sends out a model object change event and a table selection change event.
     * @param event
     */
    protected onRowUnSelect( event ): void
    {
        const methodName = "onRowUnSelect";
        this.debug( methodName + ".begin " + JSON.stringify( event ) );
        this.crudStateStore
            .sendModelObjectChangedEvent( this, null );
        this.crudController
            .sendTableSelectionChangeEvent( null );
        this.debug( methodName + ".end" );
    }

    /**
     * This method is called when the user double clicks on a row in the table.
     * @param event
     */
    protected onRowDoubleClick( event ): void
    {
        var methodName = "onRowDoubleClick";
        this.debug( methodName + ".begin " + JSON.stringify( event ) + " allowUpdates: " + this.isAllowUpdates() );
        if ( this.isAllowUpdates() )
        {
            //this.onRowSelect( event );
            //this.showFormToEdit();
            this.crudController
                .sendTableEditButtonClickedEvent();
        }
        this.debug( methodName + ".end" );
    }

    /**
     * Determines the index of a model object in the rows array
     * @returns {number} -1 if not found
     */
    protected indexOf( targetModelObject: T ): number
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
     * Removes all rows from the table.
     */
    public clearTable()
    {
        this.rows = [];
    }

    /**
     * When true, rows can be deleted.
     * @returns {boolean} Default is true
     */
    protected isAllowDeletes(): boolean
    {
        return true;
    }

    /**
     * When true, rows can be added.
     * @returns {boolean} Default is true
     */
    protected isAllowAdds(): boolean
    {
        return true;
    }

    /**
     * When true, rows can be edited.
     * @returns {boolean} Default is true
     */
    protected isAllowUpdates(): boolean
    {
        return true;
    }
}
