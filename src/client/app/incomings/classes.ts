export class Picking {
	id: number;
	name: string;
}

export class Configuration {
	id: number;
	name: string;
	regex_pn: string;
	regex_ln: string;
	regex_expdate: string;
	use_2scan: boolean;
}

export class CurrentScan {
	lotName: string;
	partNumber: string;
	expDate: string;
	scan1: string;
	scan2: string;

    public clean() {
    	this.lotName = '';
    	this.partNumber = '';
    	this.expDate = '';
    	this.scan1 = '';
    	this.scan2 = '';
    }
}
