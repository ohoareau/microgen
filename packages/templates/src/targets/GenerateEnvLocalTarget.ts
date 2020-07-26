import GenericTarget from './GenericTarget';

export class GenerateEnvLocalTarget extends GenericTarget {
    buildSteps({prefix, env = '$(env)'}) {
        if (!prefix) return [
            `../node_modules/.bin/generate-vars-from-terraform-outputs ${env} ./terraform-to-vars.json > ./.env.local`,
        ];
        return [
            `../node_modules/.bin/env ${prefix}_ > ./.env.local`,
            `../node_modules/.bin/generate-vars-from-terraform-outputs ${env} ./terraform-to-vars.json >> ./.env.local`,
        ];
    }
}

export default GenerateEnvLocalTarget