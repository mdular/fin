var Resolver = require('../lib/Resolver');

// csv fields: "Auftragskonto";"Buchungstag";"Valutadatum";"Buchungstext";"Verwendungszweck";"Beguenstigter/Zahlungspflichtiger";"Kontonummer";"BLZ";"Betrag";"Waehrung";"Info"


class SpkWueResolver extends Resolver {
    constructor (config, additionalFields) {
        super(config);
        this.BANK_NAME = 'Sparkasse Mainfranken-Würzburg';
        this.registerFields(additionalFields);
    }

    registerFields (additionalFields) {
        this.addFields({
            'bank' : {
                value: (data) => {
                    return this.BANK_NAME
                }
            },
            'account' : {
                value: 'Auftragskonto',
                validate: (data) => {
                    // validate not empty
                    if ( data !== null && data !== '') {
                        return true;
                    }

                    return false;
                }
            },
            'amount' : {
                value: (data) => {
                    return parseFloat(data['Betrag'].replace(/,/, '.'));
                }
            },
            'date' : {
                value: (data) => {
                    let date = data['Valutadatum'].split(/\./);
                    return new Date(2000 + parseInt(date[2]), date[1] - 1, date[0] - 1);
                },
                validate: (data) => {
                    // cannot be in the future
                    let date = new Date(data);
                    return date < new Date();
                }
            },
            'type' : {
                value: (data) => {
                    switch (data['Buchungstext']) {
                        case 'GELDAUTOMAT':
                            return 'atm';
                        case 'AUSZAHLUNG':
                            return 'atm';
                        case 'GUTSCHRIFT':
                            return 'inbound';
                        case 'SEPA-ELV-LASTSCHRIFT':
                            return 'debit';
                        case 'LASTSCHRIFT':
                            return 'debit';
                        case 'SONSTIGER EINZUG':
                            return 'debit';
                        case 'FOLGELASTSCHRIFT':
                            return 'debit_repeat';
                        case 'KARTENZAHLUNG':
                            return 'card_payment';
                        case 'ENTGELTABSCHLUSS':
                            return 'fee';
                        case 'ABSCHLUSS':
                            return 'fee';
                        // case 'ABSCHLUSS'
                        default:
                            console.log('unrecognised "Buchungstext":', data);
                            return 'unknown';
                    }
                },
                validate: (data) => {
                    if (data !== 'unknown') {
                        return true;
                    }

                    return false;
                }
            },
            'party' : {
                value: "Beguenstigter/Zahlungspflichtiger"
            }
        })

        if (additionalFields) {
            this.addFields(additionalFields);
        }
    }
}

module.exports = SpkWueResolver;
