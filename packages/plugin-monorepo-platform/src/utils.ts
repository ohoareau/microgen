export const buildProjectsVars = (vars: any): {
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
    const originalProjects = vars.projects || [];
    const sortedProjects = [...originalProjects];
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
