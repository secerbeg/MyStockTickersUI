/**
 * These interfaces define the pagination information received from a Spring REST service request
 * Created by mike on 9/24/2016.
 */

// http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Pageable.html

export interface PaginationPage<T>
{
    content? : Array<T>;
    last?: boolean;
    first?: boolean;
    number: number;
    size: number;
    totalElements? : number;
    totalPages? : number;
    itemsPerPage?: number;
    sort?: Array<PaginationPropertySort>;
}

export interface PaginationPropertySort
{
    direction: string;
    property: string;
}
