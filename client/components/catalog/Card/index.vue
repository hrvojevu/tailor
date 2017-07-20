<template>
  <div class="col-lg-4">
    <div @click="navigateTo" class="course-card">
      <div class="body">
        <div class="title">
          <div :style="{ color }" class="acronym">
            <span>{{ acronym }}</span>
          </div>
          {{ name }}
        </div>
        <div class="description">{{ description }}</div>
      </div>
      <div class="row">
        <span class="col-xs-6">
          <stat :name="objectiveLabel" :value="objectives"></stat>
        </span>
        <span class="col-xs-6">
          <stat name="Knowledge checks" :value="assessments"></stat>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import last from 'lodash/last';
import { OUTLINE_LEVELS } from 'shared/activities';
import pluralize from 'pluralize';
import Stat from './Stat';
import truncate from 'truncate';

const COURSE_COLORS = ['#689F38', '#FF5722', '#2196F3'];

function getAcronym(name) {
  const reducer = (acc, it) => it ? `${acc}${it[0].toUpperCase()}` : acc;
  return name.split(/\s/).reduce(reducer, '').substr(0, 2);
}

export default {
  props: ['course'],
  computed: {
    acronym() {
      return getAcronym(this.course.name);
    },
    name() {
      return truncate(this.course.name, 75);
    },
    description() {
      return truncate(this.course.description, 180);
    },
    color() {
      return COURSE_COLORS[(this.course.id || 0) % 3];
    },
    objectiveLabel() {
      return pluralize(last(OUTLINE_LEVELS).label);
    },
    assessments() {
      return get(this.course, 'stats.assessments', 0);
    },
    objectives() {
      return get(this.course, 'stats.objectives', 0);
    }
  },
  methods: {
    navigateTo() {
      if (window.getSelection().toString()) return;
      this.$router.push({
        name: 'course',
        params: { courseId: this.course.id }
      });
    }
  },
  components: {
    Stat
  }
};
</script>

<style lang="scss" scoped>
.course-card {
  min-height: 300px;
  margin-top: 40px;
  padding: 30px 30px 20px 30px;
  color: #555;
  font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.54);
  transition: box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.20), 0 8px 8px rgba(0,0,0,0.18);
  }

  .body {
    height: 220px;
    margin-bottom: 15px;
    overflow: hidden;

    @media (min-width: 1200px) and (max-width: 1300px) {
      height: 250px;
    }
  }
}

.acronym {
  display: inline-block;
  width: 45px;
  height: 45px;
  margin-right: 8px;
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  border-radius: 30px;
  background-color: #eee;

  span {
    display: inline-block;
    padding-top: 6px;
  }
}

.title {
  height: 100px;
  margin: 20px 0 10px 0;
  font-size: 20px;
  line-height: 34px;
  font-weight: 300;
  text-align: left;

  @media (min-width: 1200px) and (max-width: 1300px) {
    height: 125px;
  }
}

.description {
  max-height: 130px;
  font-size: 14px;
  text-align: left;
}
</style>