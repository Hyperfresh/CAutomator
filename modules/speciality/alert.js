const Parser = require('rss-parser')
const parser = new Parser();
const xml2js = require('xml2js')
const xmlparser = new xml2js.Parser();


module.exports = {
    commands: 'alert',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        let RSS_URL = 'http://127.0.0.1:5500/test.xml' // 'https://data.eso.sa.gov.au/prod/cfs/criimson/cfs_current_incidents.xml' // 'http://data.eso.sa.gov.au/prod/cfs/criimson/cfs_cap_incidents.xml'
        parser.parseURL(RSS_URL)
            .then(res => {
                console.log(res.items[0].content)
                console.log('parsing...')
                xmlparser.parseStringPromise(res.items[0].content).then(function (result) {
                    console.dir(result);
                    console.log('Done');
                })
                    .catch(function (err) {
                       // Failed
                    })
                if (res.items.length > 1) {
                    for ( let i = 0; i <= res.items.length; i++ ) {
                        console.log(res.items[i].content)
                        console.log('parsing...')
                        xmlparser.parseStringPromise(res.items[i].content).then(function (result) {
                            console.dir(result);
                            console.log('Done');
                        })
                            .catch(function (err) {
                            // Failed
                            });
                    }
                }
            })
        
    }
}