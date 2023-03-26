
export class GameUtils {

    public static getClientWidth(): number {
        return window.innerWidth;
    }

    public static getClientHeight(): number {
        return window.innerHeight;
    }

    public static getClientAspectRatio(): number {
        return this.getClientWidth() / this.getClientHeight();
    }

}