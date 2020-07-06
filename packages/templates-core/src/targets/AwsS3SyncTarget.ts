import AbstractAwsCliTarget from './AbstractAwsCliTarget';

export class AwsS3SyncTarget extends AbstractAwsCliTarget {
    getServiceName() {
        return 's3';
    }
    getOperationName() {
        return 'sync';
    }
    getOperationArgs({source = 'build/', target = 's3://$(bucket)'}) {
        return [source, target];
    }
    getOperationOptions() {
        return {delete: true};
    }
}

export default AwsS3SyncTarget