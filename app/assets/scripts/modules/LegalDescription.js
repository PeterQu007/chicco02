// get strata plan number

const strataPlanPrefix = ['EPS', 'BCS', 'LMS', 'BCP', 'LMP', 'PLAN', 'PL'];


class LegalDescription {
	
	constructor(legal){

		this.legal = legal.replace(/\./g, ' ');
		this.strataPlan = '';
		this.LotNumber = '';
		this.blockNumber = '';
		this.ldNumber = '';
		this.secNumber = '';
		this.rngNumber = '';

		this.getNumbers(this.legal);
	}

	getNumbers(legal){

		for (var j=0; j<strataPlanPrefix.length; j++){
			var start = legal.indexOf(strataPlanPrefix[j]);
			if (start>=0){

				var subPlan = legal.substring(start + strataPlanPrefix[j].length).trim();
				
				var plan = '';

				for (var i=0; i<subPlan.length; i++){

					if(!isNaN(subPlan[i])) {plan += subPlan[i];}
					else {break;}
				}
				this.strataPlan = strataPlanPrefix[j] + plan.trim();
				return;
			}

		}

		this.strataPlan = 'strata plan not found';

	}


}

export default LegalDescription;