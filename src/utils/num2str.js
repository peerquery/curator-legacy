
'use strict';

module.exports = {
    
    // source:  https://gist.github.com/pehrlich/2127650
    // number to string, pluginized from http://stackoverflow.com/questions/5529934/javascript-numbers-to-words


    process: function (num) {
        return this.convert(num);
    },


    ones: ['', 'one<br/>', 'two<br/>', 'three<br/>', 'four<br/>', 'five<br/>', 'six<br/>', 'seven<br/>', 'eight<br/>', 'nine<br/>'],
    tens: ['','','twenty<br/>','thirty<br/>','forty<br/>','fifty<br/>','sixty<br/>','seventy<br/>','eighty<br/>','ninety<br/>'],
    teens: ['ten<br/>','eleven<br/>','twelve<br/>','thirteen<br/>','fourteen<br/>','fifteen<br/>','sixteen<br/>','seventeen<br/>','eighteen<br/>','nineteen<br/>'],


    convert_millions: function(num) {
        if (num >= 1000000) {
            return this.convert_millions(Math.floor(num / 1000000)) + ' million &<br/> ' + this.convert_thousands(num % 1000000);
        }
        else {
            return this.convert_thousands(num);
        }
    },

    convert_thousands: function(num) {
        if (num >= 1000) {
            return this.convert_hundreds(Math.floor(num / 1000)) + ' thousand &<br/> ' + this.convert_hundreds(num % 1000);
        }
        else {
            return this.convert_hundreds(num);
        }
    },

    convert_hundreds: function(num) {
        if (num > 99) {
            return this.ones[Math.floor(num / 100)] + ' hundred &<br/> ' + this.convert_tens(num % 100);
        }
        else {
            return this.convert_tens(num);
        }
    },

    convert_tens: function(num) {
        if (num < 10) return this.ones[num];
        else if (num >= 10 && num < 20) return this.teens[num - 10];
        else {
            return this.tens[Math.floor(num / 10)] + ' ' + this.ones[num % 10];
        }
    },

    convert: function(num) {
        if (num == 0) return 'zero';
        else return this.convert_millions(num);
    },
	
};
