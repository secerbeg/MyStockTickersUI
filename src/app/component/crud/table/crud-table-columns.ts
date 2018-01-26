import { CrudTableColumn } from './crud-table-column';
import { CrudTableColumnType } from './crud-table-column-type';
import { isNullOrUndefined } from 'util';
import { Column } from 'primeng/shared';

/**
 * Manages a list of {@code CrudTableColumns}.
 */
export class CrudTableColumns
{
    private columns: CrudTableColumn[] = [];

    /**
     * Constructor.
     * @param {Column[]} columns which are expected to be instances of CrudTableColumn
     */
    constructor( columns: any[] )
    {
        this.columns = [];
        if ( !isNullOrUndefined( columns ))
        {
            columns.forEach( column => this.columns
                                           .push( column ) );
        }
    }

    /**
     * Adds a new column to the end of the list.
     * @param {CrudTableColumn} column
     */
    public addColumn( column: CrudTableColumn )
    {
        if ( column.dataType != CrudTableColumnType.CUSTOM &&
             isNullOrUndefined( column.field ) )
        {
            throw new ReferenceError( "Non custom fields must have a field property set: " +
                JSON.stringify( column ) );
        }
        this.columns.push( column );
    }

    /**
     * Iterator for the crudTableColumns.
     * @return {IterableIterator<CrudTableColumn>}
     */
    public iterator(): IterableIterator<CrudTableColumn>
    {
        return this.columns.values();
    }

    /**
     * Creates a new array from the internal array.
     * @return {CrudTableColumn[]}
     */
    public toArray(): CrudTableColumn[]
    {
        let returnColumns = [];
        this.columns
            .forEach( column => returnColumns.push( column ) );
        return returnColumns;
    }

    /**
     * Convert to a PrimeNg column array.
     * @return {Column[]}
     */
    public toColumnArray(): Column[]
    {
        let returnColumns = [];
        this.columns
            .forEach( column => returnColumns.push( column ) );
        return returnColumns;
    }

    /**
     * Adds all of the crudTableColumns from {@code crudTableColumns} to the internal column list.
     * @param {CrudTableColumns} crudTableColumns
     */
    public addAll( crudTableColumns: CrudTableColumns )
    {
        this.columns = this.columns.concat( crudTableColumns.toArray() );
    }

    /**
     * Create a new instance from a JSON string.
     * @param {string} json
     * @return {CrudTableColumns}
     */
    public static fromJSON( json: string )
    {
        let crudTableColumns = JSON.parse( json );
        return new CrudTableColumns( crudTableColumns.columns );
    }
}
