const { join } = require('path');
module.exports = function makeDbString({
    dbType,
    option
}) {
    if (dbType === 'pg') {
        const { user, password, host, port, database, schema } = option;
        const schemaString = schema ? `?schema=${schema}` : '';
        return `postgresql://${user}:${password}@${host}:${port}/${database}${schemaString}`;
    }

    if (dbType === 'mysql') {
        const { user, password, host, port, database } = option;
        return `mysql://${user}:${password}@${host}:${port}/${database}`;
    }

    if (dbType === 'sqlite') {
        const { database, url } = option;
        const databasePath = join(__dirname, '../../../databases/sqlite');

        if (url) return url;
        return `${databasePath}/${database}.db`;
    }

    throw new Error('Unknown db type');
}