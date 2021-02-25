const core = require('@actions/core');
const { Installer } = require('./installer');

/**
 * Converts a string value into a boolean.
 * @param {string | undefined} value
 * @throws {Error} Argument value must be falsy, or one of the values 'true' or 'false'.
 */
const getBoolean = (value) => {
    if (!value) {
        return false;
    }
    if (value !== 'true' && value !== 'false') {
        throw new Error(`Input must be boolean value 'true' or 'false' but got '${value}'`);
    }
    return value === 'true';
};

/**
 * @returns {Promise.<void>}
 */
const run = async () => {
    try {
        const debugMode = getBoolean(process.env.debug);
        const installer = new Installer(debugMode);
        installer.setCustomArguments(core.getInput('arguments'));
    
        core.getInput('additional-plugin-paths')
            .split(/\n?\r/)
            .map(pluginPath => pluginPath.trim())
            .filter(pluginPath => !!pluginPath)
            .forEach(pluginPath => installer.addPluginPath(pluginPath.trim()));
    
        await installer.createInstallerAsync(
            core.getInput('script-file')
        );
    } catch (error) {
        core.setFailed(error.message || 'Unexpected error occurred');
    }
}

run();
