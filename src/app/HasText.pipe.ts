import { Pipe, PipeTransform } from '@angular/core';
import {MetaData} from './paragraph/paragraph.component';

/**
 * Pipe that removes {@link MetaData} that doesn't have a text value. Prevents empty list items from rendering
 *
 * Example:
 *
 * <pre>
 * 1. foo
 * 2. bar
 * 3.
 * 4. baz
 * </pre>
 */
@Pipe({
    name: 'hasText',
    pure: false
})
export class HasTextPipe implements PipeTransform {
    transform(values: MetaData[]): MetaData[] {
        if (!values) {
            return values;
        }
        return values.filter(metadata => metadata.text !== '');
    }
}
