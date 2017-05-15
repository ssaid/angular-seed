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
