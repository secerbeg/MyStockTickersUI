import { Subject } from "rxjs";
import { ModelObject } from "../../../model/entity/modelobject";
import { Injectable } from "@angular/core";
import { BaseCrudComponentService } from "../common/base-crud-component.service";
import { DisplayDialogRequestSubjectInfo } from "./display-dialog-request-subject-info";
import { CrudOperation } from "../common/crud-operation";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DialogCloseEventType } from "../common/close-button-event";
import { Subscription } from "rxjs/Subscription";

/**
 * This service defines the Observables for interacting with a CRUD dialog.
 *
 * The following subjects are provided:
 *  - CloseButtonClicked
 *  - DisplayDialogRequest
 * Created by mike on 12/30/2016.
 */
export class CrudDialogService<T extends ModelObject<T>> extends BaseCrudComponentService<T>
{
    protected displayDialogRequestSubject: BehaviorSubject<DisplayDialogRequestSubjectInfo> = new BehaviorSubject<DisplayDialogRequestSubjectInfo>( null );
    protected closeButtonClickedSubject: Subject<DialogCloseEventType> = new Subject<DialogCloseEventType>();

    /**
     * This method must be implemented to return an instance of a DisplayDialogRequestSubjectInfo that contains
     * the model object and the crud operation to be sent to the dialog.
     */
    protected createDisplayDialogRequestSubjectInfo( modelObject: T, crudOperation: CrudOperation  ): DisplayDialogRequestSubjectInfo
    {
        var subjectInfo: DisplayDialogRequestSubjectInfo = new DisplayDialogRequestSubjectInfo();
        subjectInfo.modelObject = modelObject;
        subjectInfo.crudOperation = crudOperation;
        return subjectInfo;
    }

    /**
     * Handle the request to display the dialog
     */
    public subscribeToDisplayDialogRequestEvent( fn: ( DisplayDialogRequestSubjectInfo ) => any ): Subscription
    {
        this.debug( "subscribeToDisplayDialogRequestEvent" );
        return this.displayDialogRequestSubject.asObservable().subscribe( fn );
    }

    /**
     * Sends a request to display the CRUD dialog
     */
    public sendDisplayDialogRequestEvent( modelObject: T, crudOperation: CrudOperation )
    {
        var subjectInfo: DisplayDialogRequestSubjectInfo = this.createDisplayDialogRequestSubjectInfo( modelObject, crudOperation );
        this.debug( "sendDisplayDialogRequestEvent " + JSON.stringify( subjectInfo ));
        this.tickThenRun( () => this.displayDialogRequestSubject.next( subjectInfo ));
    }

    /**
     * The {@code CrudTableComponent} will call this method to register to receive notification when the close
     * button is clicked on the panel.
     * @return Subscription
     */
    public subscribeToCloseButtonClickedEvent( fn: ( event: DialogCloseEventType ) => any ): Subscription
    {
        var subscription: Subscription = this.closeButtonClickedSubject.asObservable().subscribe( fn );
        this.debug( "subscribeToCloseButtonClickedEvent subscribers: " + this.closeButtonClickedSubject.observers.length );
        return subscription;
    }

    /**
     * The {@code CrudPanelComponent will call this method when the user clicks the close button.
     */
    public sendCloseButtonClickedEvent( event: DialogCloseEventType )
    {
        this.debug( "sendCloseButtonClickedEvent " + DialogCloseEventType.getName( event ) + " subscribers: "
            + this.closeButtonClickedSubject.observers.length );
        this.tickThenRun( () => this.closeButtonClickedSubject.next( event ) );
    }
}
