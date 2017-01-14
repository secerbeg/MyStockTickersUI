import { BaseComponent } from "./base.component";
import { CrudOperation } from "./crud-operation";
import { ModelObject } from "../../model/base-modelobject";
import { ToastsManager } from "ng2-toastr";
/**
 * This class is the base class for all CRUD components
 *
 * Created by mike on 12/9/2016.
 */
export class BaseCrudComponent<T extends ModelObject<T>> extends BaseComponent
{
    /**
     * Identifies the type of CRUD action
     */
    protected crudOperation: CrudOperation;

    /**
     * The object that contains the form's data
     */
    protected modelObject: T;

    constructor( protected toaster: ToastsManager )
    {
        super( toaster );
    }

   /**
    * This method is called by the super class whenever an @Input() property changes.
    * It looks for specific common CRUD component properties and calls change methods
    * so that subclasses can be notified of these changes.
    * @param property
    * @param previousValue
    * @param newValue
    */
   protected inputPropertyChange( property: string, previousValue: any, newValue: any )
   {
      this.debug( "inputPropertyChange: " + property + " " + newValue );
      switch ( property )
      {
         case 'crudOperation':
             /*
              * The object might still be initializing so execute on next clock tick
              */
             //this.tickThenRun( () => this.crudOperationChanged( newValue ) );
             this.crudOperationChanged( newValue );
             break;

         case 'modelObject':
             //this.tickThenRun( () => this.modelObjectChanged( newValue ) );
             this.modelObjectChanged( newValue );
             break;
      }
   }

   /**
    * This method is called whenever the model object changes.
    * @param modelObject
    */
   protected modelObjectChanged( modelObject: T )
   {
      this.debug( "modelObjectChanged " + JSON.stringify( modelObject ));
      this.modelObject = modelObject;
   }

    /**
     * Allow sub classes to change the model object through a method that will record (log) the change.
     * @param modelObject
     */
   protected setModelObject( modelObject: T )
   {
       this.debug( "setModelObject " + JSON.stringify( modelObject ));
       this.modelObject = modelObject;
   }

   /**
    * This method is called whenever the crudOperation changes.
    * @param crudOperation
    */
   protected crudOperationChanged( crudOperation: CrudOperation )
   {
      this.debug( "crudOperation change " + crudOperation );
      this.crudOperation = crudOperation;
   }

    /**
     * Allow subclasses to change the {@code CrudOperation} and log the change.
     * @param crudOperation
     */
    protected setCrudOperation( crudOperation: CrudOperation )
    {
        this.debug( "setCrudOperation " + crudOperation );
        this.crudOperation = crudOperation;
    }

    protected tickThenRun( fn: () => any )
    {
        setTimeout( fn, 0 );
    }

    /**
     * Returns true if the current {@code crudOperation} value is CREATE
     * @return {boolean}
     */
    protected isCrudInsertOperation(): boolean
    {
        return this.crudOperation == CrudOperation.CREATE;
    }

    /**
     * Returns true if the current {@code crudOperation} value is UPDATE
     * @return {boolean}
     */
    protected isCrudUpdateOperation(): boolean
    {
        return this.crudOperation == CrudOperation.UPDATE;
    }

    /**
     * Returns true if the current {@code crudOperation} value is DELETE
     * @return {boolean}
     */
    protected isCrudDeleteOperation(): boolean
    {
        return this.crudOperation == CrudOperation.DELETE;
    }
}
