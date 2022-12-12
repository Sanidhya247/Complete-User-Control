const adminResolver = require('./admin');
const managerRsolver = require('./manager');
const userResolver = require('./user');
const authentication = require('./auth');
const requestResolver = require('./request');

const rootResolver = {
    ...adminResolver,
    ...managerRsolver,
    ...userResolver,
    ...authentication,
    ...requestResolver
};

module.exports = rootResolver;