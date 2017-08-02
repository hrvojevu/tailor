/**
 * @swagger
 * definitions:
 *   CourseInput:
 *     type: object
 *     required:
 *     - name
 *     - description
 *     properties:
 *       name:
 *         type: string
 *         description: course title
 *       description:
 *         type: string
 *         description: short course description
 *   CourseOutput:
 *     type: object
 *     required:
 *     - id
 *     - name
 *     - description
 *     - users
 *     properties:
 *       id:
 *         type: number
 *         description: unique course identifier
 *       name:
 *         type: string
 *         description: course title
 *       description:
 *         type: string
 *         description: short course description
 *       users:
 *         type: array
 *         description: user course roles
 */
module.exports = function (sequelize, DataTypes) {
  const Course = sequelize.define('course', {
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, len: [2, 250] }
    },
    description: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true, len: [2, 2000] }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    classMethods: {
      associate(models) {
        Course.hasMany(models.Activity, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Course.hasMany(models.TeachingElement, {
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
        Course.belongsToMany(models.User, {
          through: models.CourseUser,
          foreignKey: { name: 'courseId', field: 'course_id' }
        });
      }
    },
    instanceMethods: {
      getUser(user) {
        return this.getUsers({ where: { id: user.id } })
          .then(users => users[0]);
      },
      getInventoryItems() {
        const where = { detached: false };
        return Promise.all([
          this.getActivities({ where }),
          this.getTeachingElements({ where, order: [['activityId', 'ASC']] })
        ])
        .then(([activities, tes]) => ({ activities, tes }));
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return Course;
};
