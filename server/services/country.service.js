const countryModel = require("../models/country.model");

exports.save = async (data) => {
  const country = new countryModel(data);
  return await country.save();
};

exports.update = async (matchQuery, updateData) => {
  const update = await countryModel.updateMany(matchQuery, {
    $set: updateData
  });
  return update;
};

exports.updateOne = async (matchQuery, updateData) => {
  const country = await countryModel.findOneAndUpdate(matchQuery, updateData);
  return country;
};

exports.findOne = async (data) => {
  return await countryModel.findOne(data).lean();
};

exports.findAll = async ({ page, limit }) => {
  const mongoQuery = [
    { $project: { "_id": 0 } },
    {
      $facet: {
        country: [{ $skip: (page - 1) * limit }, { $limit: +limit }],
        totalCount: [{ $count: 'count' }]
      }
    },
    {
      $project: {
        country: 1,
        totalCount: { $arrayElemAt: ['$totalCount.count', 0] }
      }
    }
  ];
  const countries = await countryModel.aggregate(mongoQuery)
  if (countries) {
    return countries[0]
  } else {
    return false
  }
};

exports.deleteOne = async (data) => {
  return await countryModel.findOneAndDelete(data);
};

exports.findAllByFilter = async (filter) => {
  return await adminModel.find(filter);
};

exports.findOneByFilter = async (filter) => {
  return await adminModel.findOne(filter).lean();
};


exports.findAllVerified = async ({ page, limit }) => {
  const mongoQuery = [
    {
      $match: {
        isBlocked: false
      }
    },
    { $project: { "_id": 0 } },
    {
      $facet: {
        country: [{ $skip: (page - 1) * limit }, { $limit: +limit }],
        totalCount: [{ $count: 'count' }]
      }
    },
    {
      $project: {
        country: 1,
        totalCount: { $arrayElemAt: ['$totalCount.count', 0] }
      }
    }
  ];
  const countries = await countryModel.aggregate(mongoQuery)
  if (countries) {
    return countries[0]
  } else {
    return false
  }
};