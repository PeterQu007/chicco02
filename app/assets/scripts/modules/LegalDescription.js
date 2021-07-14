// get strata plan number

const strataPlanPrefix = [
  "EPS",
  "BCS",
  "LMS",
  "BCP",
  "LMP",
  "NWS",
  "EPP",
  "PLAN",
  "PL",
  "NW",
  "VAS",
];

class LegalDescription {
  constructor(legal) {
    this.legal = legal.replace(/\./g, " ");
    this.strataPlan1 = "";
    this.strataPlan2 = "";
    this.strataPlan3 = "";
    this.strataPlan4 = "";
    this.LotNumber = "";
    this.blockNumber = "";
    this.ldNumber = "";
    this.secNumber = "";
    this.rngNumber = "";

    this.getNumbers(this.legal);
  }

  getNumbers(legal) {
    for (var j = 0; j < strataPlanPrefix.length; j++) {
      var start = legal.indexOf(strataPlanPrefix[j]);
      if (start >= 0) {
        var subPlan = legal
          .substring(start + strataPlanPrefix[j].length)
          .trim();

        var plan = "";

        for (var i = 0; i < subPlan.length; i++) {
          if (!isNaN(subPlan[i])) {
            plan += subPlan[i];
          } else {
            break;
          }
        }
        this.strataPlan1 = strataPlanPrefix[j] + plan.trim();
        this.strataPlan2 = strataPlanPrefix[j] + plan.trim() + " ";
        this.strataPlan3 = strataPlanPrefix[j] + " " + plan.trim();
        this.strataPlan4 = strataPlanPrefix[j] + " " + plan.trim() + " ";
        return;
      }
    }

    this.strataPlan1 = "strata plan not found";
  }
}

export default LegalDescription;
