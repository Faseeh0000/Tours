import { Tour } from "../models/tourModel.js";

// GET all tours with filters, sorting, fields, pagination
export const getAllToursService = async (queryParams) => {
  const queryObj = { ...queryParams };
  const excludedFields = ["page", "sort", "fields", "limit"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Convert filters (gte/gt/lte/lt)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Tour.find(JSON.parse(queryStr));

  // Sorting
  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Field selection
  if (queryParams.fields) {
    const fields = queryParams.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // Pagination
  const page = queryParams.page * 1 || 1;
  const limit = queryParams.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (queryParams.page) {
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error("Page does not exist");
  }

  return await query;
};

export const getTourByIdService = (id) => {
  return Tour.findById(id);
};

export const getTourByNameService = (name) => {
  return Tour.findOne({ name });
};

export const createTourService = (tourData) => {
  return Tour.create(tourData);
};

export const updateTourService = (id, data) => {
  return Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteTourService = (id) => {
  return Tour.findByIdAndDelete(id);
};

export const getTourStatsService = () => {
  return Tour.aggregate([
    { $match: { rating: { $gte: 4 } } },
    {
      $group: {
        _id: { $toUpper: "$duration" },
        numTours: { $sum: 1 },
        totalRating: { $sum: "$rating" },
        avgRating: { $avg: "$rating" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);
};

export const getMnthlyPlan= ()=>{
    
}