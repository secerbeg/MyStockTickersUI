/**
 * Created by mike on 9/16/2016.
 */
/**
 * Angular Imports
 */
import { NgModule }       from '@angular/core';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { CommonModule }   from "@angular/common";
import { BrowserModule  } from '@angular/platform-browser';
import { HttpModule  }    from '@angular/http';

/**
 * PrimeNG
 */
import { InputTextModule,
         DataTableModule,
         MenubarModule,
         ButtonModule,
         DialogModule,
         DropdownModule,
         PanelModule,
         TabMenuModule,
         SelectButtonModule,
         GrowlModule } from 'primeng/primeng';

/**
 * Bootstrap
 */
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

/**
 * Application Imports
 */
import { Logger }                  from './service/logger.service';
import { routing }                 from './app_routes';
import { StockService }            from './service/stock.service';
import { PortfolioService }        from './service/portfolio.service';
import { StockExchangeService }    from './service/stock-exchange.service';
import { SessionService }          from './service/session.service';
import { AppConfigurationService } from "./service/app-configuration.service";
import { AppComponent }            from './app.component';
import { StockTableComponent }     from './component/stock/stock-table.component';
import { MenuBarComponent }        from './component/common/menu-bar.component';
import { DashboardComponent }      from './component/dashboard/dashboard.component';
import { StockFormComponent }      from "./component/stock/stock-form.component";
import { PortfolioTableComponent } from "./component/portfolio/portfolio-table.component";
import { UppercaseDirective }      from "./directives/uppercase.directive";
import { loggerServiceProvider } from "./providers/logger.service.provider";

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
        // PrimeNG modules
        DropdownModule,
        DataTableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectButtonModule,
        TabMenuModule,
        GrowlModule,
        PanelModule,
        MenubarModule,
        // ng2-bootstrap modules
        AlertModule
    ],
    declarations:
    [
        AppComponent,
        MenuBarComponent,
        StockTableComponent,
        StockFormComponent,
        PortfolioTableComponent,
        DashboardComponent,
        UppercaseDirective
    ],
    bootstrap:
    [
        AppComponent
    ],
    providers:
    [
        // Global providers -- singletons
        StockService,
        PortfolioService,
        StockExchangeService,
        Logger,
        SessionService,
        AppConfigurationService
    ]
})
export class AppModule {}
