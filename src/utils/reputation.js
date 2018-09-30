

module.exports = {
    
    rep: function(reputation) {
        if (reputation == null) return reputation;
        let rep = String(reputation);
        const neg = rep.charAt(0) === '-';
        rep = neg ? rep.substring(1) : rep;

        let out = this.log10(rep);
        if (isNaN(out)) out = 0;
        out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
        out = (neg ? -1 : 1) * out;
        out = out * 9 + 25; // 9 points per magnitude. center at 25
        // base-line 0 to darken and < 0 to auto hide (grep rephide)
        out = parseInt(out);
        return out;
    },

    log10: function(str) {
        const leadingDigits = parseInt(str.substring(0, 4));
        const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
        const n = str.length - 1;
        return n + (log - parseInt(log));
    },

};
	