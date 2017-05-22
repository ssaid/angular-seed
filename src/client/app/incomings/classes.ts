export class Picking {
	id: number;
	name: string;
}

export class Configuration {
	id: number;
	name: string;
	regex_pn: string;
	regex_pn_fl: string;
	regex_ln: string;
	regex_ln_fl: string;
	regex_expdate: string;
	regex_expdate_fl: string;
	use_2scan: boolean;
	ln_prefix: string;
	ln_suffix: string;
}

export class CurrentScan {
	lotName: string;
	partNumber: string;
	expDate: string;
	scan1: string;
	scan2: string;
	ok: boolean;
	qty: number = 1;

    public clean() {
    	this.lotName = '';
    	this.partNumber = '';
    	this.expDate = '';
    	this.scan1 = '';
    	this.scan2 = '';
    	this.ok = false;
    	this.qty = 1;
    }
}
