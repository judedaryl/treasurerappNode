
var production = false;

var prod_uri = "mongodb://treasurerapp:1234@ds163769.mlab.com:63769/treasurerapp";
var test_uri = "mongodb://treasurerapp:1234@ds113640.mlab.com:13640/treasurerapp-test";



module.exports = {
    mongodb_uri: production? prod_uri : test_uri
};