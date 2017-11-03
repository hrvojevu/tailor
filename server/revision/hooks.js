const addHooks = require('../shared/util/addHooks');
const { constant } = require('to-case');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, models) {
  const { Course, Activity, TeachingElement } = models;
  const hooksDict = {
    afterCreate: 'CREATE',
    afterUpdate: 'UPDATE',
    afterDestroy: 'REMOVE'
  };
  const hooks = Object.keys(hooksDict);

  // TODO: Courses are soft deleted already?
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when courses are soft-deleted:
  addHooks(Course, ['afterCreate', 'afterUpdate'], createRevision);

  addHooks(Activity, hooks, createRevision);
  addHooks(TeachingElement, hooks, createRevision);

  function createRevision(hook, instance, { context }) {
    if (!context || !context.userId) return;
    const model = instance.constructor;
    const courseId = model.name === Course.name ? instance.id : instance.courseId;
    const entity = constant(model.name);
    const operation = hooksDict[hook];
    const state = instance.get({ plain: true });
    logger.info(`[Revision] ${entity}#${hook}`, { entity, operation, id: instance.id, courseId });
    return Revision.create({ courseId, entity, operation, state, userId: context.userId });
  }
}
