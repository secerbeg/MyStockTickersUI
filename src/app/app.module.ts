///<reference path="service/crud/stock-notes-crud.service.ts"/>
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
    InputTextareaModule,
    RatingModule,
    CalendarModule
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
import { StockExchangeService } from "./service/crud/stock-exchange.service";
import { SessionService } from "./service/crud/session.service";
import { AppConfigurationService } from "./service/app-configuration.service";
import { AppComponent } from "./app.component";
import { StockTableComponent } from "./component/stock/stock-table.component";
import { MenuBarComponent } from "./component/menubar/menu-bar.component";
import { DashboardComponent } from "./component/dashboard/dashboard.component";
import { StockFormComponent } from "./component/stock/stock-form.component";
import { UppercaseDirective } from "./directives/uppercase.directive";
import { PortfolioStockFormComponent } from "./component/portfoliostock/portfolio-stock-form.component";
import { PortfolioStockTableComponent } from "./component/portfoliostock/portfolio-stock-table.component";
import { PortfolioStockFactory } from "./model/factory/portfolio-stock.factory";
import { StockFactory } from "./model/factory/stock.factory";
import { PortfolioFactory } from "./model/factory/portfolio.factory";
import { StockSectorCrudService } from "./service/crud/stock-sector-crud.service";
import { StockAutoCompleteComponent } from "./component/common/stock-autocomplete.component";
import { StockTableButtonsComponent } from "./component/stock/stock-table-buttons.component";
import { StockDialogComponent } from "./component/stock/stock-dialog.component";
import { PortfolioStockDialogComponent } from "./component/portfoliostock/portfolio-stock-dialog.component";
import { PortfolioStockTableButtonsComponent } from "./component/portfoliostock/portfolio-stock-table-buttons.component";
import { PortfolioDialogComponent } from "./component/portfolio/portfolio-dialog.component";
import { PortfolioFormComponent } from "./component/portfolio/portfolio-form.component";
import { PortfolioTableComponent } from "./component/portfolio/portfolio-table.component";
import { PortfolioTableButtonsComponent } from "./component/portfolio/portfolio-table-buttons.component";
import { StockSectorFactory } from "./model/factory/stock-sector.factory";
import {StockNotesDialogComponent} from "./component/stocknotes/stock-notes-dialog.component";
import {StockNotesTableComponent} from "./component/stocknotes/stock-notes-table.component";
import {StockNotesFormComponent} from "./component/stocknotes/stock-notes-form.component";
import { StockFormButtonsComponent } from "./component/stock/stock-form-buttons.component";
import { PortfolioStockFormButtonsComponent } from "./component/portfoliostock/portfolio-stock-form-buttons.component";
import { PortfolioFormButtonsComponent } from "./component/portfolio/portfolio-form-buttons.component";
import { StockNotesTableButtonsComponent } from "./component/stocknotes/stock-notes-table-buttons.component";
import { StockNotesFormButtonsComponent } from "./component/stocknotes/stock-notes-form-buttons.component";
import { StockNotesCrudServiceContainer } from "./component/stocknotes/stock-notes-crud-service-container";
import { PortfolioStockCrudServiceContainer } from "./component/portfoliostock/portfolio-stock-crud-service-container";
import { PortfolioCrudServiceContainer } from "./component/portfolio/porfolio-crud-service-container";
import { StockCrudServiceContainer } from "./component/stock/stock-crud-service-container";
import { StockCrudService } from "./service/crud/stock-crud.service";
import { PortfolioCrudService } from "./service/crud/portfolio-crud.service";
import { PortfolioStockCrudService } from "./service/crud/portfolio-stock-crud.service";
import { StockNotesCrudService } from "./service/crud/stock-notes-crud.service";
import { StockNotesFactory } from "./model/factory/stock-notes.factory";
import { StockNotesCountService } from "./service/crud/stock-notes-count.service";
import { StockNotesCountFactory } from "./model/factory/stock-note-count.factory";

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
        InputTextareaModule,
        RatingModule,
        CalendarModule,
        // Third Party modules
        ToastModule.forRoot()
    ],
    declarations:
    [
        AppComponent,
        MenuBarComponent,

        StockTableComponent,
        StockFormComponent,
        StockDialogComponent,
        StockFormButtonsComponent,
        StockTableButtonsComponent,

        PortfolioTableComponent,
        PortfolioFormComponent,
        PortfolioFormButtonsComponent,
        PortfolioDialogComponent,
        PortfolioTableButtonsComponent,

        PortfolioStockTableComponent,
        PortfolioStockTableButtonsComponent,
        PortfolioStockFormComponent,
        PortfolioStockDialogComponent,
        PortfolioStockFormButtonsComponent,

        StockNotesTableComponent,
        StockNotesFormComponent,
        StockNotesDialogComponent,
        StockNotesTableButtonsComponent,
        StockNotesFormButtonsComponent,

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
        StockCrudServiceContainer,
        StockSectorCrudService,
        StockExchangeService,
        StockFactory,
        StockSectorFactory,

        PortfolioFactory,
        PortfolioCrudService,
        PortfolioCrudServiceContainer,

        PortfolioStockCrudService,
        PortfolioStockCrudServiceContainer,
        PortfolioStockFactory,

        StockNotesCrudService,
        StockNotesCrudServiceContainer,
        StockNotesFactory,

        StockNotesCountService,
        StockNotesCountFactory,

        SessionService,
        ConfirmationService,
        AppConfigurationService,
        ToastOptions,
        ToastsManager
    ]
})
export class AppModule {}
