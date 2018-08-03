/**
 * Created by mike on 3/10/2018
 */
import { TradeItAccount } from '../../model/entity/tradeit-account';
import { ChangeDetectorRef, Component } from '@angular/core';
import { TradeItAccountCrudService } from '../../service/crud/tradeit-account-crud.service';
import { TradeItAccountFactory } from '../../model/factory/tradeit-account.factory';
import { SessionService } from '../../service/session.service';
import { ToastsManager } from 'ng2-toastr';
import { CrudTableEditButtonComponent } from '../crud/table/crud-table-edit-button.component';
import { TradeItAccountStateStore } from '../tradeit-account/tradeit-account-state-store';
import { TradeItAccountController } from '../tradeit-account/tradeit-account-controller';

@Component
({
     selector: 'tradeit-account-table-edit-button',
     templateUrl: '../crud/table/crud-table-button.component.html'
 })
export class TradeItAccountTableEditButtonComponent extends CrudTableEditButtonComponent<TradeItAccount>
{
    /**
     * Constructor.
     * @param {ToastsManager} toaster
     * @param {SessionService} session
     * @param {TradeItAccountStateStore} tradeItAccountStateStore
     * @param {TradeItAccountController} tradeItAccountController
     * @param {TradeItAccountFactory} tradeItAccountFactory
     * @param {TradeItAccountCrudService} tradeItAccountCrudService
     */
    constructor( protected changeDetector: ChangeDetectorRef,
                 protected toaster: ToastsManager,
                 private session: SessionService,
                 private tradeItAccountStateStore: TradeItAccountStateStore,
                 private tradeItAccountController: TradeItAccountController,
                 private tradeItAccountFactory: TradeItAccountFactory,
                 private tradeItAccountCrudService: TradeItAccountCrudService )
    {
        super( changeDetector,
               toaster,
               tradeItAccountStateStore,
               tradeItAccountController,
               tradeItAccountFactory,
               tradeItAccountCrudService );
    }
}
