const options = [];

const header = ['navigator.platform', 'navigator.userAgent', 'navigator.appVersion', 'navigator.vendor'];

const dataos = [
    { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
    { name: 'Windows', value: 'Win', version: 'NT' },
    { name: 'iPhone', value: 'iPhone', version: 'OS' },
    { name: 'iPad', value: 'iPad', version: 'OS' },
    { name: 'Kindle', value: 'Silk', version: 'Silk' },
    { name: 'Android', value: 'Android', version: 'Android' },
    { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
    { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
    { name: 'Macintosh', value: 'Mac', version: 'OS X' },
    { name: 'Linux', value: 'Linux', version: 'rv' },
    { name: 'Palm', value: 'Palm', version: 'PalmOS' }
];

const databrowser = [
    { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
    { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
    { name: 'Safari', value: 'Safari', version: 'Version' },
    { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
    { name: 'Opera', value: 'Opera', version: 'Opera' },
    { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
    { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
];

export class DeviceInfo {
    private static instance: DeviceInfo = null;
    // desktop or mobile
    private _desktop = false;
    // is iOS?
    private _iOS = false;
    // is safari
    private _safari = false;
    // is Android
    private _android = false;

    private _devicePixelRatio = 1;

    constructor() {
        if (DeviceInfo.instance) throw new Error("Don't use InputMng.constructor(), it's SINGLETON, use getInstance() method");

        /*
        console.log('navigator.platform: ', navigator.platform);
        console.log('navigator.userAgent: ', navigator.userAgent);
        console.log('navigator.appVersion: ', navigator.appVersion);
        console.log('navigator.vendor: ', navigator.vendor);
        */

        let agent = navigator.userAgent;
        let os = this.matchItem(agent, dataos);
        let browser = this.matchItem(agent, databrowser);

        /*
        console.log('navigator os: ', os);
        console.log('navigator browser: ', browser);
        */

        this._desktop = !(
            agent.match(/Android/i) ||
            agent.match(/webOS/i) ||
            agent.match(/iPhone/i) ||
            agent.match(/iPad/i) ||
            agent.match(/iPod/i) ||
            agent.match(/BlackBerry/i) ||
            agent.match(/Windows Phone/i)
        );

        this._devicePixelRatio = window.devicePixelRatio || 1;

    }

    static getInstance(): DeviceInfo {
        if (!DeviceInfo.instance) {
            DeviceInfo.instance = new DeviceInfo();
        }
        return DeviceInfo.instance;
    }

    private matchItem(str: string, data: any[]) {
        var i = 0,
            j = 0,
            html = '',
            regex,
            regexv,
            match,
            matches,
            version;

        for (i = 0; i < data.length; i += 1) {
            regex = new RegExp(data[i].value, 'i');
            match = regex.test(str);
            if (match) {
                regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                matches = str.match(regexv);
                version = '';
                if (matches) { if (matches[1]) { matches = matches[1]; } }
                if (matches) {
                    matches = matches.split(/[._]+/);
                    for (j = 0; j < matches.length; j += 1) {
                        if (j === 0) {
                            version += matches[j] + '.';
                        } else {
                            version += matches[j];
                        }
                    }
                } else {
                    version = '0';
                }
                return {
                    name: data[i].name,
                    version: parseFloat(version)
                };
            }
        }
        return { name: 'unknown', version: 0 };
    }


    public get desktop(): boolean {
        return this._desktop;
    }

    public get devicePixelRatio(): number {
        return this._devicePixelRatio;
    }

}