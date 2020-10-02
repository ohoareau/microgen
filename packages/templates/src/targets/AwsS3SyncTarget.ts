import AbstractAwsCliTarget from './AbstractAwsCliTarget';

export class AwsS3SyncTarget extends AbstractAwsCliTarget {
    getServiceName() {
        return 's3';
    }
    getOperationName() {
        return 'sync';
    }
    getOperationArgs({source = 'build/', target = 's3://$(bucket)', targetDir = undefined}) {
        return [source, targetDir ? `${target}/${targetDir}` : target];
    }
    getOperationOptions() {
        return {delete: true};
    }
}

export default AwsS3SyncTarget