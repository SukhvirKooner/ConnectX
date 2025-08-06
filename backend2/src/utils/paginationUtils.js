/**
 * Create pagination for query results
 * @param {Object} model - Mongoose model
 * @param {Object} query - Query object
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of items per page
 * @param {Object} options - Additional options (populate, sort, etc.)
 * @returns {Object} - Paginated results with metadata
 */
const paginate = async (model, query = {}, page = 1, limit = 10, options = {}) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(query);

  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: endIndex < total
  };

  if (pagination.hasMore) {
    pagination.nextPage = page + 1;
  }

  if (startIndex > 0) {
    pagination.prevPage = page - 1;
  }

  let results = model.find(query).skip(startIndex).limit(limit);

  // Apply additional options
  if (options.sort) {
    results = results.sort(options.sort);
  }

  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach(field => {
        results = results.populate(field);
      });
    } else {
      results = results.populate(options.populate);
    }
  }

  if (options.select) {
    results = results.select(options.select);
  }

  // Execute query
  const data = await results;

  return {
    data,
    pagination
  };
};

/**
 * Create pagination for aggregation results
 * @param {Object} model - Mongoose model
 * @param {Array} pipeline - Aggregation pipeline
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of items per page
 * @returns {Object} - Paginated results with metadata
 */
const aggregatePaginate = async (model, pipeline = [], page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;

  // Create a copy of the pipeline to avoid modifying the original
  const countPipeline = [...pipeline];
  
  // Add count stage to get total documents
  countPipeline.push({ $count: 'total' });
  
  // Get total count
  const countResult = await model.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Create pagination metadata
  const pagination = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: startIndex + limit < total
  };

  if (pagination.hasMore) {
    pagination.nextPage = page + 1;
  }

  if (startIndex > 0) {
    pagination.prevPage = page - 1;
  }

  // Add pagination stages to the original pipeline
  const paginatedPipeline = [...pipeline];
  paginatedPipeline.push({ $skip: startIndex });
  paginatedPipeline.push({ $limit: limit });

  // Execute the paginated aggregation
  const data = await model.aggregate(paginatedPipeline);

  return {
    data,
    pagination
  };
};

module.exports = {
  paginate,
  aggregatePaginate
};