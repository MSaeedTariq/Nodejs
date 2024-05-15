class ApiFeatures {
  constructor(modelQuery, requestQuery) {
    this.modelQuery = modelQuery;
    this.requestQuery = requestQuery;
  }

  filter() {
    const queryObj = { ...this.requestQuery };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((value) => delete queryObj[value]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);

    this.modelQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.requestQuery.sort) {
      // Handling Multiple Sorting (replace comma with space)
      const sortByArray = this.requestQuery.sort.split(',').join(' ');
      this.modelQuery = this.modelQuery.sort(sortByArray);
    } else {
      this.modelQuery = this.modelQuery.sort({ createdAt: -1, _id: 1 });
    }
    return this;
  }

  limitFields() {
    if (this.requestQuery.fields) {
      const fields = this.requestQuery.fields.split(',').join(' ');
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.requestQuery.page * 1 || 1;
    const limit = this.requestQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // Apply pagination
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;