/**
 * Created by mike on 3/10/2018
 */
import { GainsLosses } from '../../model/entity/gains-losses';
import { ChangeDetectorRef, Component } from '@angular/core';
import { GainsLossesCrudService } from '../../service/crud/gains-losses-crud.service';
import { GainsLossesFactory } from '../../model/factory/gains-losses.factory';
import { SessionService } from '../../service/session.service';
import { ToastsManager } from 'ng2-toastr';
import { CrudTableEditButtonComponent } from '../crud/table/crud-table-edit-button.component';
import { GainsLossesStateStore } from '../gains-losses/gains-losses-state-store';
import { GainsLossesController } from '../gains-losses/gains-losses-controller';

@Component
({
     selector: 'gains-losses-table-edit-button',
     templateUrl: '../crud/table/crud-table-button.component.html'
 })
export class GainsLossesTableEditButtonComponent extends CrudTableEditButtonComponent<GainsLosses>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} session
     * @param {GainsLossesStateStore} gainsLossesStateStore
     * @param {GainsLossesController} gainsLossesController
     * @param {GainsLossesFactory} gainsLossesFactory
     * @param {GainsLossesCrudService} gainsLossesCrudService
     */
    constructor( protected changeDetector: ChangeDetectorRef,
                 protected toaster: ToastsManager,
                 private session: SessionService,
                 private gainsLossesStateStore: GainsLossesStateStore,
                 private gainsLossesController: GainsLossesController,
                 private gainsLossesFactory: GainsLossesFactory,
                 private gainsLossesCrudService: GainsLossesCrudService )
    {
        super( changeDetector,
               toaster,
               gainsLossesStateStore,
               gainsLossesController,
               gainsLossesFactory,
               gainsLossesCrudService );
    }
}
