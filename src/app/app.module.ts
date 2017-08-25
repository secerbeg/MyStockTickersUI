///<reference path="service/stock-note-crud.service.ts"/>
/**
 * Created by mike on 9/16/2016.
 */
/**
 * Angular Imports
 */
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

/**
 * PrimeNG
 */
import {
    InputTextModule,
    DataTableModule,
    MenubarModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    PanelModule,
    TabMenuModule,
    TabViewModule,
    SelectButtonModule,
    ConfirmDialogModule,
    ConfirmationService,
    InputTextareaModule
} from "primeng/primeng";
import { TieredMenuModule } from "primeng/components/tieredmenu/tieredmenu";
import { AutoCompleteModule } from "primeng/components/autocomplete/autocomplete";
import { InputMaskModule } from "primeng/components/inputmask/inputmask";
import { FieldsetModule } from "primeng/components/fieldset/fieldset";
/**
 * Third party imports
 */
import {ToastModule, ToastOptions, ToastsManager} from "ng2-toastr/ng2-toastr";
/**
 * Application Imports
 */
import { routing } from "./app_routes";
import { StockExchangeService } from "./service/stock-exchange.service";
import { SessionService } from "./service/session.service";
import { AppConfigurationService } from "./service/app-configuration.service";
import { AppComponent } from "./app.component";
import { StockTableComponent } from "./component/stock/stock-table.component";
import { MenuBarComponent } from "./component/menubar/menu-bar.component";
import { DashboardComponent } from "./component/dashboard/dashboard.component";
import { StockFormComponent } from "./component/stock/stock-form.component";
import { UppercaseDirective } from "./directives/uppercase.directive";
import { PortfolioStockFormComponent } from "./component/portfoliostock/portfolio-stock-form.component";
import { PortfolioStockCrudService } from "./service/portfolio-stock-crud.service";
import { PortfolioStockTableComponent } from "./component/portfoliostock/portfolio-stock-table.component";
import { StockPanelComponent } from "./component/stock/stock-panel.component";
import { PortfolioStockFactory } from "./model/factory/portfolio-stock.factory";
import { StockFactory } from "./model/factory/stock.factory";
import { StockFormService } from "./component/stock/stock-form.service";
import { PortfolioStockFormService } from "./component/portfoliostock/portfolio-stock-form.service";
import { StockCrudService } from "./service/stock-crud.service";
import { PortfolioCrudService } from "./service/portfolio-crud.service";
import { PortfolioFactory } from "./model/factory/portfolio.factory";
import { StockSectorCrudService } from "./service/stock-sector-crud.service";
import { StockAutoCompleteComponent } from "./component/common/stock-autocomplete.component";
import { PortfolioStockPanelButtonsComponent } from "./component/portfoliostock/portfolio-stock-panel-buttons.component";
import { StockPanelButtonsComponent } from "./component/stock/stock-panel-buttons.component";
import { StockPanelButtonsService } from "./component/stock/stock-panel-buttons.service";
import { PortfolioPanelButtonsService } from "./component/portfolio/portfolio-panel-buttons.service";
import { PortfolioStockPanelButtonsService } from "./component/portfoliostock/portfolio-stock-panel-buttons.service";
import { StockTableButtonsService } from "./component/stock/stock-table-buttons.service";
import { StockTableButtonsComponent } from "./component/stock/stock-table-buttons.component";
import { StockDialogService } from "./component/stock/stock-dialog.service";
import { PortfolioStockTableButtonsService } from "./component/portfoliostock/portfolio-stock-table-buttons.service";
import { StockDialogComponent } from "./component/stock/stock-dialog.component";
import { PortfolioStockDialogService } from "./component/portfoliostock/portfolio-stock-dialog.service";
import { PortfolioStockDialogComponent } from "./component/portfoliostock/portfolio-stock-dialog.component";
import { PortfolioStockTableButtonsComponent } from "./component/portfoliostock/portfolio-stock-table-buttons.component";
import { PortfolioTableButtonsService } from "./component/portfolio/portfolio-table-buttons.service";
import { PortfolioFormService } from "./component/portfolio/portfolio-form.service";
import { PortfolioDialogComponent } from "./component/portfolio/portfolio-dialog.component";
import { PortfolioFormComponent } from "./component/portfolio/portfolio-form.component";
import { PortfolioPanelComponent } from "./component/portfolio/portfolio-panel.component";
import { PortfolioTableComponent } from "./component/portfolio/portfolio-table.component";
import { PortfolioPanelButtonsComponent } from "./component/portfolio/portfolio-panel-buttons.component";
import { PortfolioTableButtonsComponent } from "./component/portfolio/portfolio-table-buttons.component";
import { PortfolioDialogService } from "./component/portfolio/portfolio-dialog.service";
import { StockSectorFactory } from "./model/factory/stock-sector.factory";
import {StockNotesDialogComponent} from "./component/stocknotes/stock-notes-dialog.component";
import {StockNotesTableComponent} from "./component/stocknotes/stock-notes-table.component";
import {StockNotesTableButtonsComponent} from "./component/stocknotes/stock-notes-table-buttons.component";
import {StockNotesFormComponent} from "./component/stocknotes/stock-notes-form.component";
import {StockNotesPanelButtonsComponent} from "./component/stocknotes/stock-notes-panel-buttons.component";
import {StockNoteCrudService} from "./service/stock-note-crud.service";
import {StockNoteFactory} from "./model/factory/stock-note.factory";
import {StockNotesFormService} from "./component/stocknotes/stock-notes-form.service";
import {StockNotesTableButtonsService} from "./component/stocknotes/stock-notes-table-buttons.service";
import {StockNotesPanelButtonsService} from "./component/stocknotes/stock-notes-panel-buttons.service";
import {StockNotesDialogService} from "./component/stocknotes/stock-notes-dialog.service";
import {StockNoteCountFactory} from "./model/factory/stock-note-count.factory";
import { StockNotesPanelComponent } from "./component/stocknotes/stock-notes-panel.component";

@NgModule({
    imports:
    [
        // Angular2 modules
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        HttpModule,
        BrowserAnimationsModule,
        // PrimeNG modules
        DropdownModule,
        InputMaskModule,
        DataTableModule,
        FieldsetModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectButtonModule,
        TabMenuModule,
        TabViewModule,
        AutoCompleteModule,
        PanelModule,
        MenubarModule,
        TieredMenuModule,
        ConfirmDialogModule,
        ToastModule.forRoot(),
        InputTextareaModule
        // Third Party modules
    ],
    declarations:
    [
        AppComponent,
        MenuBarComponent,

        StockTableComponent,
        StockFormComponent,
        StockDialogComponent,
        StockPanelComponent,
        StockPanelButtonsComponent,
        StockTableButtonsComponent,

        PortfolioTableComponent,
        PortfolioFormComponent,
        PortfolioDialogComponent,
        PortfolioPanelComponent,
        PortfolioPanelButtonsComponent,
        PortfolioTableButtonsComponent,

        PortfolioStockTableComponent,
        PortfolioStockTableButtonsComponent,
        PortfolioStockFormComponent,
        PortfolioStockDialogComponent,
        PortfolioStockPanelButtonsComponent,

        StockNotesTableComponent,
        StockNotesTableButtonsComponent,
        StockNotesFormComponent,
        StockNotesDialogComponent,
        StockNotesPanelComponent,
        StockNotesPanelButtonsComponent,

        DashboardComponent,
        UppercaseDirective,
        StockAutoCompleteComponent
    ],
    bootstrap:
    [
        AppComponent
    ],
    providers:
    [
        // Global providers -- singletons
        StockCrudService,
        StockSectorCrudService,
        StockFormService,
        StockPanelButtonsService,
        StockTableButtonsService,
        StockExchangeService,
        StockDialogService,
        StockFactory,

        PortfolioCrudService,
        PortfolioFormService,
        PortfolioDialogService,
        PortfolioTableButtonsService,
        PortfolioPanelButtonsService,
        PortfolioStockDialogService,
        PortfolioFactory,

        PortfolioStockCrudService,
        PortfolioStockFormService,
        PortfolioStockTableButtonsService,
        PortfolioStockPanelButtonsService,
        PortfolioStockDialogService,
        PortfolioStockFactory,

        StockNoteCrudService,
        StockNotesFormService,
        StockNotesTableButtonsService,
        StockNotesPanelButtonsService,
        StockNotesDialogService,
        StockNoteFactory,
        StockNoteCountFactory,

        StockSectorFactory,
        SessionService,
        ConfirmationService,
        AppConfigurationService,
        ToastOptions,
        ToastsManager
    ]
})
export class AppModule {}
