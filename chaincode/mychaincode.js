const shim = require('fabric-shim');
const util = require('util');

// example dummy chaincode written in node
// useful links:
// https://jira.hyperledger.org/browse/FAB-2331
// https://fabric-sdk-node.github.io/
// https://github.com/hyperledger/fabric-sdk-node
// https://www.youtube.com/watch?v=dzwR0dwzXNs&list=PLfuKAwZlKV0_--JYykteXjKyq0GA9j_i1&index=21
var Chaincode = class {
        Init(stub) {
                return stub.putState('dummyKey', Buffer.from('dummyValue'))
                        .then(() => {
                                console.info('Chaincode instantiation is successful');
                                return shim.success();
                        }, () => {
                                return shim.error();
                        });
        }

        Invoke(stub) {
                console.info('Transaction ID: ' + stub.getTxID());
                console.info(util.format('Args: %j', stub.getArgs()));

                let ret = stub.getFunctionAndParameters();
                console.info('Calling function: ' + ret.fcn);

                return stub.getState('dummyKey')
                .then((value) => {
                        if (value.toString() === 'dummyValue') {
                                console.info(util.format('successfully retrieved value "%j" for the key "dummyKey"', value ));
                                return shim.success();
                        } else {
                                console.error('Failed to retrieve dummyKey or the retrieved value is not expected: ' + value);
                                return shim.error();
                        }
                });
        }
};

shim.start(new Chaincode());

