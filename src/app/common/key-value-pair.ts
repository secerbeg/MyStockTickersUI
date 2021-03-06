export class KeyValuePair<K,V>
{
    private _key: K;
    private _value: V;

    constructor( key: K, value: V )
    {
        this._key = key;
        this._value = value;
    }

    get key(): K
    {
        return this._key;
    }

    set key( value: K )
    {
        this._key = value;
    }

    get value(): V
    {
        return this._value;
    }

    set value( value: V )
    {
        this._value = value;
    }
}
