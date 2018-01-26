import { Component } from "@angular/core";

/**
 * Stock notes source table buttons.
 * Created by mike on 3/16/2018.
 */
@Component({
    selector: 'stock-notes-source-table-buttons',
    template: `<ng-template #refreshButtonTemplate>
                    <stock-notes-source-table-add-button>
                    </stock-notes-source-table-add-button>
                    <stock-notes-source-table-edit-button>
                    </stock-notes-source-table-edit-button>
                    <stock-notes-source-table-delete-button>
                    </stock-notes-source-table-delete-button>
                    <stock-notes-source-table-refresh-button>
                    </stock-notes-source-table-refresh-button>
               </ng-template>
               <crud-table-buttons [addButtonTemplate]="addButtonTemplate"
                                   [editButtonTemplate]="editButtonTemplate"
                                   [deleteButtonTemplate]="deleteButtonTemplate"
                                   [refreshButtonTemplate]="refreshButtonTemplate">
               </crud-table-buttons>`
})
export class StockNotesSourceTableButtonsComponent
{
}
