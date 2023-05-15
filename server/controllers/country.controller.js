'use strict';
const responseUtil = require('../utils/responseUtils');
const MessageUtil = require('../utils/messageUtil');
const countryService = require("../services/country.service");
const { v4: uuidv4 } = require('uuid');

exports.getAllCountry = async (req, res) => {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 10;
    const queryParams = {
        page,
        limit
    };
    try {
        const response = await countryService.findAll(queryParams);
        if (response) {
            responseUtil.successResponse(res, MessageUtil.success, response[0]);
        } else {
            responseUtil.failResponse(res, MessageUtil.requestedDataNotFound, response);
        }
    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};

exports.getCountryById = async (req, res) => {
    const countryId = req.params.id;
    try {
        if (!countryId) {
            responseUtil.throwError(MessageUtil.invalidRequest);
        }
        const response = await countryService.findOne({ id: countryId });
        if (response != null) {
            responseUtil.successResponse(res, MessageUtil.success, response);
        } else {
            responseUtil.failResponse(res, MessageUtil.requestedDataNotFound, response);
        }

    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};

exports.createCountry = async (req, res) => {
    const {
        name,
        description,
        countryCode,
        isBlocked
    } = req.body;
    const id = uuidv4();
    try {
        const data = {
            id: id,
            name: name,
            description: description,
            countryCode: countryCode,
            isBlocked: isBlocked
        };
        const newCountry = await countryService.save(data);
        if (newCountry) {
            responseUtil.successResponse(res, MessageUtil.success, newCountry);
        } else {
            responseUtil.failResponse(res, MessageUtil.somethingWentWrong, newCountry);
        }
    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};

exports.updateCountryById = async (req, res) => {
    const reqBody = req.body;
    const countryId = req.params.id;
    try {
        const response = await countryService.updateOne({ id: countryId }, reqBody);
        if (response) {
            const updatedCountry = await countryService.findOne({ id: countryId });
            responseUtil.successResponse(res, MessageUtil.success, updatedCountry);
        } else {
            responseUtil.failResponse(res, MessageUtil.requestedDataNotFound, response);
        }
    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};

exports.deleteCountryById = async (req, res) => {
    const countryId = req.params.id;
    try {
        if (!countryId) {
            responseUtil.throwError(MessageUtil.invalidRequest);
        }
        const response = await countryService.deleteOne({ id: countryId });
        if (response) {
            responseUtil.successResponse(res, MessageUtil.success, `Country Deleted Successfully`);
        } else {
            responseUtil.failResponse(res, MessageUtil.requestedDataNotFound, response);
        }
    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};

exports.getCountryByFilter = async (req, res) => {
    const filterData = req.body;
    try {
        if (!filterData) {
            responseUtil.throwError(MessageUtil.invalidRequest);
        }
        const response = await countryService.findAllByFilter(filterData);
        if (response.length) {
            responseUtil.successResponse(res, MessageUtil.success, response);
        } else {
            responseUtil.failResponse(res, MessageUtil.requestedDataNotFound, response);
        }

    } catch (err) {
        responseUtil.errorResponse(res, err.message);
    }
};