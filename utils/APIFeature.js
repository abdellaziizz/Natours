class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObject = { ...this.queryString }; //DESTRUCTUREING
    const execludedFields = ['sort', 'limit', 'page', 'fields'];
    execludedFields.forEach((el) => {
      delete queryObject[el];
    });
    let queryStrng = JSON.stringify(queryObject);

    let querystr = queryStrng.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    this.query = Tour.find(JSON.parse(querystr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //To add more than value to sort with
      this.query = query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sorting with createdAt
    }
    return this;
  }
  paginate() {
    if (this.queryString.page) {
      const page = Number(this.queryString.page) || 1;
      const limit = Number(this.queryString.limit) || 1;

      const skipValue = (page - 1) * limit;
      this.query = this.query.skip(skipValue).limit(limit);
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      query = query.select('-_v');
    }
    return this;
  }
}
export default APIFeatures;
