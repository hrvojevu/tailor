import VuexCollection from '../helpers/collection.js';

const { state, getter, action, mutation, build } = new VuexCollection('courses', '/courses');
const PAGINATION_DEFAULTS = { offset: 0, limit: 9 };

state({
  search: '',
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    sort: {
      order: 'DESC',
      field: 'updatedAt'
    },
    allCoursesFetched: false
  }
});

getter(function courses() {
  return this.state.items;
}, { global: true });

getter(function courseQueryParams() {
  const { pagination, sort } = this.state.$internals;
  const search = this.state.search;

  return {
    search,
    offset: pagination.offset,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field
  };
}, { global: true });

getter(function hasMoreResults() {
  return !this.state.$internals.allCoursesFetched;
});

action(function fetch() {
  const params = this.getters.courseQueryParams;
  return this.api.get('', params).then(response => {
    const { data: courses } = response.data;

    let result = {};
    courses.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', { offset: params.offset + params.limit });
    this.commit('allCoursesFetched', courses.length < params.limit);
    this.commit('fetch', result);
  });
});

mutation(function resetPagination() {
  this.state.$internals.pagination = PAGINATION_DEFAULTS;
});

mutation(function setPagination(changes) {
  let $internals = this.state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
});

mutation(function setSearch(query = '') {
  this.state.items = {};
  this.state.$internals.pagination = PAGINATION_DEFAULTS;
  this.state.search = query;
});

mutation(function allCoursesFetched(allFetched) {
  this.state.$internals.allCoursesFetched = allFetched;
});

export default build();
