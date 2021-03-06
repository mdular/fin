var Index = require('../lib/Index');

class EventsIndex extends Index {
    constructor (options) {
        super(Object.assign({}, options, {indexName:"events"}));
    }

    ensureMapping () {
        return super.ensureMapping({
            "default": {
                "dynamic": false,
                "properties": {
                    "account": {
                        "type": "string"
                    },
                    "amount": {
                        "type": "double"
                    },
                    "bank": {
                        "type": "string"
                    },
                    "date": {
                        "type": "date",
                        "format": "strict_date_optional_time||epoch_millis"
                    },
                    "party": {
                        "type": "string"
                    },
                    "type": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "info": {
                        "type": "string"
                    },
                    "_data": {
                        "type": "object",
                        "enabled": false
                    }
                }
            }
        });
    }
}

module.exports = EventsIndex;
