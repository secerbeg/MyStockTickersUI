import { BaseComponent } from './base.component';
import { CachedValueState } from '../../common/cached-value-state.enum';
import { ToastsManager } from 'ng2-toastr';

/**
 * This is the base class for components that display model object information that has the potential of being asynchronously
 * fetched from the backend.  This component, with the use of the {@code CachedValueComponent} which displays the correct modelObjectRows
 * based on the state of the data, identifies a custom template and abstract methods that subclass must implement as
 * well as default values for the failure, stale, and not found messages.
 */
export abstract class BaseCachedValueComponent extends BaseComponent
{
    /**
     * Constructor
     * @param {ToastsManager} toaster
     */
    protected constructor( protected toaster: ToastsManager )
    {
        super( toaster );
    }

    /**
     * Returns the cached modelObjectRows state.
     * @return {CachedValueState}
     */
    protected abstract getCachedValueState(): CachedValueState;

    /**
     * Returns the message to display if the state of the modelObjectRows is STALE
     * @return {string}
     */
    protected getStaleMessage(): string
    {
        return "Loading...";
    }

    /**
     * Returns the failure message if the cached modelObjectRows state is FAILURE.
     * @return {string}
     */
    protected getFailureMessage(): string
    {
        return "Failure";
    }

    /**
     * Returns the not found message if the cached modelObjectRows state is NOT_FOUND.
     * @return {string}
     */
    protected getNotFoundMessage(): string
    {
        return "Not Found";
    }
}
