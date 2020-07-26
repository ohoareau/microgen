import GenericTarget from './GenericTarget';

export class OutputsTarget extends GenericTarget {
    buildSteps(options: any) {
        return [
            `mkdir -p ../outputs/$(env)`,
            `$(foreach l,$(layers),echo "[$(env)] Saving outputs of layer '$(l)'..." && AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output-json $l > ../outputs/$(env)/$(l).json;)`,
        ];
    }
}

export default OutputsTarget