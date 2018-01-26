/**
 * Created by mike on 11/25/2017
 */
import { CrudFormComponent } from "../crud/form/crud-form.component";
import { ModelObject } from "../../model/entity/modelobject";
import { ToastsManager } from "ng2-toastr";
import { CustomerCrudService } from "../../service/crud/customer-crud.service";
import { SelectItem } from "primeng/primeng";
import { StockNotesSourceList } from "../stock-notes/stock-notes-source-list";
import { isNullOrUndefined } from "util";
import { StockNotesSourceContainer } from "../../common/stock-notes-source-container";
import { isNumeric } from "rxjs/util/isNumeric";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { ModelObjectFactory } from '../../model/factory/model-object.factory';
import { CrudController } from '../crud/common/crud-controller';
import { CrudStateStore } from '../crud/common/crud-state-store';
import { CrudRestService } from '../../service/crud/crud-rest.serivce';

/**
 * This class contains the methods to handle forms for entities with note sources.
 */
export abstract class CrudFormWithNotesSourceComponent<T extends ModelObject<T> & StockNotesSourceContainer>
    extends CrudFormComponent<T>
{
    protected sourceItems: SelectItem[] = [];
    private stockNotesSourceList: StockNotesSourceList = new StockNotesSourceList( [] );
    private sourceAdded: boolean;

    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {CrudStateStore<T extends ModelObject<T> & StockNotesSourceContainer>} crudStateStore
     * @param {CrudController<T extends ModelObject<T> & StockNotesSourceContainer>} crudController
     * @param {ModelObjectFactory<T extends ModelObject<T> & StockNotesSourceContainer>} modelObjectFactory
     * @param {CrudRestService<T extends ModelObject<T> & StockNotesSourceContainer>} crudRestService
     * @param {CustomerCrudService} customerCrudService
     */
    constructor( protected toaster: ToastsManager,
                 protected crudStateStore: CrudStateStore<T>,
                 protected crudController: CrudController<T>,
                 protected modelObjectFactory: ModelObjectFactory<T>,
                 protected crudRestService: CrudRestService<T>,
                 protected customerCrudService: CustomerCrudService )
    {
        super( toaster,
               crudStateStore,
               crudController,
               modelObjectFactory,
               crudRestService )

    }

    /**
     * This method is called after {@code loadResources() and ngOnInit() have completed}.  At that time, the form
     * has been built and the source names have been loaded so it's safe to set the source name field.
     */
    protected postInit(): void
    {
        super.postInit();
        //this.debug( "CrudFormWithNotesSourceComponent.postInit setting notesSourceId to " + this.modelObject.getNotesSourceId() );
        //this.setFormValue( 'notesSource', this.modelObject.getNotesSourceId() );
    }

    /**
     * Sets the default values.  In this, we reset the sources changed flag.
     */
    protected setDefaultValues(): void
    {
        this.sourceAdded = false;
        super.setDefaultValues();
    }

    /**
     * Gets the source name for the notes source container.
     * @param {T} notesSourceContainer
     * @return {string}
     */
    protected getSourceName( notesSourceContainer: T ): string
    {
        if ( isNullOrUndefined( notesSourceContainer ) )
        {
            return "";
        }
        this.debug( "getSourceName: " + JSON.stringify( notesSourceContainer ));
        return this.stockNotesSourceList.getLabel( notesSourceContainer.getNotesSourceId() );
    }

    /**
     * This method is called whenever the notes source changes.  When the user types in a new source, each keystroke
     * will cause a call to this method.  Since we get the source id from the drop down list as the value, we need to
     * capture the name of any new source that the user types in so we assign that value here to the modelObject.
     *
     * @param event
     */
    protected sourcesOnChange( event )
    {
        this.debug( "sourcesOnChange: " + JSON.stringify( event ));
        /*
         * Capture the new values that the user types and put in the source name
         */
        if ( !isNumeric( event.value ))
        {
            this.modelObject.setNotesSourceName( event.value.toUpperCase() );
            this.modelObject.setNotesSourceId( 0 );
            this.sourceAdded = true;
            this.setFormValue( 'notesSourceId', event.value.toUpperCase() )
        }
        else
        {
            this.debug( "sourcesOnChange: setting notesSourceId= " + event.value );
            this.modelObject.setNotesSourceId( event.value );
            this.modelObject.setNotesSourceName( this.stockNotesSourceList.getLabel( event.value ));
        }
    }

    /**
     * this method is called just before form data is saved.
     * We need to check to see if a new source was added and if so, create a new sources in the database.
     */
    protected prepareToSave(): void
    {
        this.debug( "prepareToSave checking for added source " + JSON.stringify( this.modelObject ))
        super.prepareToSave();
        /*
         * When the user adds new source the component puts the name of the new source in the id field.
         * Don't like it, but there it is.
         */
        if ( !isNumeric( this.modelObject.getNotesSourceId() ))
        {
            /*
             * When a new source is added, what the user types in goes into the notesSourceId which is a numeric field, the
             * value also goes into the notesSourceName field by the sourcesOnChange event.  We need to make notesSourceId
             * to be numeric so that it can be sent to the backend without JSON parsing errors
             */
            this.debug( this.modelObject.getNotesSourceName() + " is a new source" );
            this.modelObject.setNotesSourceName( "" + this.modelObject.getNotesSourceId() );
            this.modelObject.setNotesSourceId( 0 );
        }
    }

    /**
     * This method is overridden to check to see if the user added a new source.  if so, we need to notify the customer
     * service that the sources changed.
     * @param {StockNotes} modelObject
     */
    protected onSaveButtonClicked()
    {
        this.debug( "onSaveButtonClicked" );
        super.onSaveButtonClicked();
        if ( this.sourceAdded )
        {
            this.customerCrudService.stockNoteSourcesChanged();
        }
    }

    /**
     * Loads the customer's sources
     */
    protected loadResources(): Observable<boolean>[]
    {
        this.debug( "CrudFormWithNotesSource.loadResources.begin")
        var sourcesLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );
        this.customerCrudService
            .subscribeToSourcesLoading( (loading)=>
                                            {
                                                this.debug( "loadResources customerService is loading: " + loading );
                                                if ( !loading )
                                                {
                                                    this.stockNotesSourceList = this.customerCrudService.getStockNotesSourceList();
                                                    this.sourceItems = this.stockNotesSourceList.toSelectItems();
                                                    this.debug( "loadResources source items set " + JSON.stringify( this.sourceItems ) );
                                                    this.debug( "CrudFormWithNotesSource.loadResources.end");
                                                    sourcesLoadingSubject.next( true );
                                                    sourcesLoadingSubject.complete();
                                                }
                                            });
        return [sourcesLoadingSubject.asObservable()];
    }
}
