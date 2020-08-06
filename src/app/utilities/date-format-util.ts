import * as moment from 'moment';

export function prettyDate(input: string) {
    return moment(input).format('MMM Do, YYYY');
}
