const { Comment } = require('../shared/database');
const { User } = require('../shared/database');

function sanitizeDeleted(comments) {
  const deletedMsg = 'This comment has been deleted';
  return comments.map(comment => {
    if (!comment.deletedAt) return comment;
    return Object.assign(comment, { content: deletedMsg });
  });
}

function list({ activity, opts }, res) {
  const include = [{ model: User, attributes: ['email'] }];
  return activity.getComments({ ...opts, include })
    .then(sanitizeDeleted)
    .then(data => res.json({ data }));
}

function show({ comment }, res) {
  return res.json({ data: comment });
}

function create({ body, params, user }, res) {
  const { content } = body;
  const { activityId } = params;
  const userId = user.id;
  return Comment.create({ content, activityId, userId })
    .then(comment => res.json({ data: comment }));
}

function patch({ comment, body }, res) {
  const { content } = body;
  return comment.update({ content })
    .then(data => res.json({ data }));
}

function remove({ comment }, res) {
  return comment.destroy()
    .then(data => res.json({ data }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
