export class SpinnerUtil {

    public static showSpinner() {
        document.getElementById('spinner-overlay').hidden = false;
    }

    public static hideSpinner() {
        document.getElementById('spinner-overlay').hidden = true;
    }
}