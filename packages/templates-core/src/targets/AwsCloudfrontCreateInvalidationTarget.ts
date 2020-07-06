import AbstractAwsCliTarget from './AbstractAwsCliTarget';

export class AwsCloudfrontCreateInvalidationTarget extends AbstractAwsCliTarget {
    getServiceName() {
        return 'cloudfront';
    }
    getOperationName() {
        return 'create-invalidation';
    }
    getOperationOptions({distribution = '$(cloudfront)', path = '/*'}) {
        return {
            ['distribution-id']: distribution,
            paths: `'${path}'`,
        }
    }
}

export default AwsCloudfrontCreateInvalidationTarget