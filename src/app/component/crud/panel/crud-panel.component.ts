import { ToastsManager } from "ng2-toastr";
import { ModelObject } from "../../../model/entity/modelobject";
import { BaseCrudComponent } from "../common/base-crud.component";
import { OnInit } from "@angular/core";
import { CrudOperation } from "../common/crud-operation";
import { CrudStateStore } from '../common/crud-state-store';
import { CrudController } from '../common/crud-controller';
import { ModelObjectFactory } from '../../../model/factory/model-object.factory';

/**
 * This is a Panel class that contains a CRUD Form component {@code CrudFormComponent}
 *
 * @param <T> Read Model Type and Search Criteria
 *
 * Created by mike on 11/27/2016.
 */
export abstract class CrudPanelComponent<T extends ModelObject<T>>
    extends BaseCrudComponent<T>
    implements OnInit
{
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
    }

    /**
     * Initialize the class
     */
    public ngOnInit()
    {
        this.log( "CrudPanelComponent.ngOnInit.begin" );
        super.ngOnInit();
        this.subscribeToCrudFormServiceEvents();
        this.subscribeToCrudPanelServiceEvents();
        this.log( "CurdPanelComponent.ngOnInit.end" );
    }

    /**
     * This method is called to set the model object and crud operation.
     * @param {T} modelObject
     * @param {CrudOperation} crudOperation
     */
    //protected displayModelObject( modelObject: T, crudOperation: CrudOperation )
    protected displayModelObject()
    {
        //this.setModelObject( modelObject );
        //this.setCrudOperation( crudOperation );
        //var subjectInfo: ModelObjectCrudOperationSubjectInfo = new ModelObjectCrudOperationSubjectInfo();
        //subjectInfo.crudOperation = crudOperation;
        //subjectInfo.modelObject = modelObject;

        /*
         * Tell the buttons and form of the changes
         */
        //this.debug( "Sending crud operation and modelObject to Form" );
        //this.crudServiceContainer
        //    .crudFormService
        //    .sendModelObjectCrudOperationChangedEvent( subjectInfo );
        //this.debug( "Sending crud operation and modelObject to the form buttons" );
        //this.crudServiceContainer
        //    .crudFormButtonsService
        //    .sendCrudOperationChangedEvent( subjectInfo.crudOperation );
        //this.crudServiceContainer
        //    .crudFormButtonsService
        //    .sendModelObjectChangedEvent( subjectInfo.modelObject );
        this.crudController
            .sendFormPrepareToDisplayEvent();
    }

    /**
     * Subscribes to the events received from the CrudFormButtonsService
     */
    protected subscribeToCrudPanelServiceEvents(): void
    {
        this.debug( "subscribeToCrudPanelServiceEvents.begin" );
        this.addSubscription( this.crudController
                                  .subscribeToDisplayFormRequestEvent( () => this.displayModelObject() ));
        this.addSubscription( this.crudController
                                  .subscribeToCancelButtonClickedEvent( () => this.cancelButtonClicked() ));
        this.debug( "subscribeToCrudPanelServiceEvents.end" );
    }

    /**
     * Subscribes to the events received from the CrudFormService
     */
    protected subscribeToCrudFormServiceEvents(): void
    {
        this.debug( "subscribeToCrudFormServiceEvents.begin" );
        this.addSubscription( this.crudController
                                  .subscribeToDeleteButtonClickCompletedEvent( modelObject => this.deleteButtonClickCompleted( modelObject ) ));
        this.addSubscription( this.crudController
                                  .subscribeToSaveButtonClickCompletedEvent( modelObject => this.saveButtonClickCompleted( modelObject ) ));
        this.addSubscription( this.crudController
                                  .subscribeToAddButtonClickCompletedEvent( modelObject => this.addButtonClickCompleted( modelObject ) ));
        this.debug( "subscribeToCrudFormServiceEvents.end" );
    }

    protected onSubmit(): void
    {
        this.debug( "onSubmit " + JSON.stringify( this.modelObject ));
    }

    /**
     * This method is called when the cancel button is clicked.
     */
    protected cancelButtonClicked()
    {
        this.debug( "cancelButtonClicked" );
        this.resetCrudOperationAndModelObject();
    }

    /**
     * This method is called upon the successful completion of deleting a model object.
     * @param customerAccount
     */
    protected deleteButtonClickCompleted( modelObject: T )
    {
        this.debug( "deleteButtonClickCompleted" );
        this.resetPanel();
    }

    /**
     * This method is called upon the successful completion of adding a model object.
     * @param modelObject
     */
    protected addButtonClickCompleted( modelObject: T )
    {
        this.debug( "addButtonClickCompleted" );
        this.resetPanel();
    }

    /**
     * This method is called upon the successful completion of saving a model object.
     * @param modelObject
     */
    protected saveButtonClickCompleted( modelObject: T )
    {
        this.debug( "saveButtonClickCompleted" );
        this.resetPanel();
    }

    protected resetPanel()
    {
    }
}
