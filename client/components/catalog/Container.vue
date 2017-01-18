<template>
  <div class="catalog">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <search @change="filterCourses" :showLoader="showLoader"></search>
      </div>
      <div class="col-md-3">
        <create-course class="pull-right"></create-course>
      </div>
    </div>
    <div class="row">
      <course-list :courses="courses" :showLoader="showLoader"></course-list>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Promise from 'bluebird';
import CourseList from './List';
import CreateCourse from './Create';
import Search from './Search';

export default {
  data() {
    return {
      showLoader: false
    };
  },
  computed: mapGetters(['courses']),
  methods: {
    ...mapActions(['fetch'], 'courses'),
    ...mapMutations(['setSearch', 'resetPagination'], 'courses'),
    fetchCourses() {
      this.showLoader = true;
      this.resetPagination();
      return Promise.join(this.fetch(), Promise.delay(400)).then(() => {
        this.showLoader = false;
      });
    },
    filterCourses(query) {
      this.showLoader = true;
      debounce(() => {
        this.setSearch(query);
        this.fetchCourses();
      }, 700)();
    }
  },
  created() {
    this.fetchCourses();
  },
  beforeDestroy() {
    this.setSearch('');
  },
  components: {
    CreateCourse,
    CourseList,
    Search
  }
};
</script>

<style lang="scss" scoped>
.catalog {
  min-height: 101%;
  padding: 20px 100px 100px 100px;

  @media (min-width: 1700px) {
    padding: 20px 300px 100px 300px;
  }
}
</style>