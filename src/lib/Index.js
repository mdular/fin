class Index {
    constructor (options) {
        if (!options.client) {
            throw new Error('Argument error: client must be set');
        }

        this.options = options;
        this.defaultType = options.defaultType || 'default';
        this.indexName = options.index || 'default';
        this.client = options.client;
    }

    delete () {
        return this.client.indices.delete({index: this.indexName});
    }

    create (value) {
        return this.client.indices.create({index: this.indexName});
    }

    ensureMapping (mapping) {
        let keys = Object.keys(mapping);

        if (keys.length > 1) {
            throw new Error("Index error: mapping must contain only 1 type");
        }

        if (keys.length < 1) {
            throw new Error("Index error: mapping must contain type");
        }

        return this.client.indices.putMapping({
            index: this.indexName,
            type: keys[0],
            "body": mapping
        });
    }

    index (documents, type) {
        let parsedCount = 0;
        let indexedCount = 0;
        let docs = documents;
        let promises = [];

        for (let i in docs) {
            let doc = docs[i];
            parsedCount++;

            promises.push(this.client.create({
                index: this.indexName,
                type: type || this.defaultType,
                // id: '2',
                body: doc
            }).then((value) => {
                indexedCount++;
            }));
        }

        return Promise.all(promises)
        .then((value) => {
            console.log(`indexed: ${indexedCount} of ${parsedCount}`);
        }, (reason) => {
            console.log('rejected', reason);
        });
    }
}

module.exports = Index;
