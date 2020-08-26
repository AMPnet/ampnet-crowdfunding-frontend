declare var $: any;

export class SpinnerUtil {

    static counter = 0;

    public static showSpinner() {
        $('#spinner-overlay').fadeIn(300);
    }

    public static hideSpinner() {
        $('#spinner-overlay').fadeOut(300);
    }
}
