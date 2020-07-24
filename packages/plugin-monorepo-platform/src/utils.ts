export const applySort = (a, b) => a > b ? 1 : (a === b ? 0 : -1);
export const applySortBy = (a, b, k) => applySort(a[k], b[k]);
export const applySortBys = (a, b, ks) => applySortBy(a, b, ks.find(k => !!a[k]));

export const buildTechnologiesVars = (vars: any): {
    originalTechnologies: any,
    sortedTechnologies: any[],
} => {
    const originalTechnologies = vars.technologies || {};
    const sortedTechnologies = Object.entries(originalTechnologies).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    sortedTechnologies.sort((a, b) => a.name > b.name ? 1 : (a.name === b.name ? 0 : -1));
    return {
        originalTechnologies,
        sortedTechnologies,
    };
};
export const buildPreRequisitesVars = (vars: any): {
    originalPreRequisites: any,
    sortedPreRequisites: any[],
} => {
    const originalPreRequisites = vars.preRequisites || {};
    const sortedPreRequisites = Object.entries(originalPreRequisites).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    //sortedPreRequisites.sort((a, b) => applySortBys( a, b, ['priority', 'name', 'id']));
    return {
        originalPreRequisites,
        sortedPreRequisites,
    };
};
export const buildInstallProceduresVars = (vars: any): {
    originalInstallProcedures: any,
    sortedInstallProcedures: any[],
} => {
    const originalInstallProcedures = vars.installProcedures || {};
    const sortedInstallProcedures = Object.entries(originalInstallProcedures).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    //sortedInstallProcedures.sort((a, b) => applySortBys( a, b, ['priority', 'name', 'id']));
    return {
        originalInstallProcedures,
        sortedInstallProcedures,
    };
};
export const buildProjectEnvsVars = (vars: any): {
    originalProjectEnvs: any,
    sortedProjectEnvs: any[],
} => {
    const originalProjectEnvs = vars.project_envs || {};
    const sortedProjectEnvs = Object.entries(originalProjectEnvs).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    sortedProjectEnvs.sort((a, b) => applySortBys( a, b, ['priority', 'name', 'id']));
    return {
        originalProjectEnvs,
        sortedProjectEnvs,
    };
};

export const buildProjectsVars = (vars: any): {
    originalProjects: any,
    sortedProjects: any[],
    deployableProjects: any[],
    buildableProjects: any[],
    buildablePreProjects: any[],
    buildablePostProjects: any[],
    testableProjects: any[],
    generateEnvLocalableProjects: any[],
    preInstallableProjects: any[],
    installableProjects: any[],
    startableProjects: any[],
    refreshableProjects: any[],
} => {
    const originalProjects = vars.projects || {};
    const sortedProjects = Object.entries(originalProjects).reduce((acc, [id, v]) => {
        acc.push({id, name: id, ...<any>v});
        return acc;
    }, <any[]>[]);
    sortedProjects.sort((a, b) => a.name > b.name ? 1 : (a.name === b.name ? 0 : -1));
    const deployableProjects = sortedProjects.filter(p => !!p.deployable);
    const buildableProjects = sortedProjects.filter(p => (undefined === p.buildable) || !!p.buildable);
    const buildablePreProjects = buildableProjects.filter(p => 'pre' === p.phase);
    const buildablePostProjects = buildableProjects.filter(p => 'pre' !== p.phase);
    const testableProjects = sortedProjects.filter(p => (undefined === p.testable) || !!p.testable);
    const generateEnvLocalableProjects = sortedProjects.filter(p => (undefined === p.buildable) || !!p.buildable);
    const preInstallableProjects = sortedProjects.filter(p => (undefined === p.preInstallable) || !!p.preInstallable);
    const installableProjects = sortedProjects.filter(p => (undefined === p.installable) || !!p.installable);
    const startableProjects = sortedProjects.filter(p => !!p.startable);
    const refreshableProjects = sortedProjects.filter(p => !!p.refreshable);
    return {
        originalProjects,
        sortedProjects,
        deployableProjects,
        buildableProjects,
        buildablePreProjects,
        buildablePostProjects,
        testableProjects,
        generateEnvLocalableProjects,
        preInstallableProjects,
        installableProjects,
        startableProjects,
        refreshableProjects,
    };
};
