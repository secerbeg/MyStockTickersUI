import { ModelObject } from "../../../model/entity/modelobject";
import { BaseCrudComponentService } from "../common/base-crud-component.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ModelObjectFactory } from "../../../model/factory/model-object.factory";

/**
 * This class handles the default behaviour for the buttons used in a CRUD enabled table.
 *
 * Created by mike on 1/2/2017.
 */
export class CrudTableButtonsService<T extends ModelObject<T>> extends BaseCrudComponentService<T>
{
    private addButtonClickedSubject: BehaviorSubject<T>;
    private deleteButtonClickedSubject: BehaviorSubject<T>;
    private editButtonClickedSubject: BehaviorSubject<T>;

    constructor( protected modelObjectFactory: ModelObjectFactory<T> )
    {
        super( modelObjectFactory );
        this.addButtonClickedSubject = new BehaviorSubject<T>( this.modelObjectFactory.newModelObject() );
        this.deleteButtonClickedSubject = new BehaviorSubject<T>( this.modelObjectFactory.newModelObject() );
        this.editButtonClickedSubject = new BehaviorSubject<T>( this.modelObjectFactory.newModelObject() );
    }

    /**
     * The {@code CrudTableComponent} will call this method to register to receive notification when the Add
     * button is clicked on the panel.
     */
    public subscribeToAddButtonClickedEvent( fn: ( T ) => any )
    {
        this.log( "subscribeToAddButtonClickedEvent" );
        this.addButtonClickedSubject.asObservable().subscribe( fn );
    }

    /**
     * The {@code CrudPanelComponent will call this method when the user clicks the Add button.
     */
    public sendAddButtonClickedEvent( modelObject: T )
    {
        this.log( "sendAddButtonClickedEvent " + JSON.stringify( modelObject ) );
        this.tickThenRun( () => this.addButtonClickedSubject.next( modelObject ) );
    }

    /**
     * The {@code CrudTableComponent} will call this method to register to receive notification when the Delete
     * button is clicked on the panel.
     */
    public subscribeToDeleteButtonClickedEvent( fn: ( T ) => any )
    {
        this.log( "subscribeToDeleteButtonClickedEvent" );
        this.deleteButtonClickedSubject.asObservable().subscribe( fn );
    }

    /**
     * The {@code CrudPanelComponent will call this method when the user clicks the Delete button.
     */
    public sendDeleteButtonClickedEvent( modelObject: T )
    {
        this.log( "sendDeleteButtonClickedEvent" );
        this.tickThenRun( () => this.deleteButtonClickedSubject.next( modelObject ) );
    }

    /**
     * The {@code CrudTableComponent} will call this method to register to receive notification when the Edit
     * button is clicked on the panel.
     */
    public subscribeToEditButtonClickedEvent( fn: ( T ) => any )
    {
        this.log( "subscribteToEditButtonClickedEvent" );
        this.editButtonClickedSubject.asObservable().subscribe( fn );
    }

    /**
     * The {@code CrudPanelComponent will call this method when the user clicks the Edit button.
     */
    public sendEditButtonClickedEvent( modelObject: T )
    {
        this.log( "sendEditButtonClickedEvent" );
        this.tickThenRun( () => this.editButtonClickedSubject.next( modelObject ) );
    }
}