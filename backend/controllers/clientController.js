import Client from "../models/clientModel.js";
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

function generateUniqueId(name) {
    let startThreeAlpha = name.slice(0, 3).toUpperCase();
    let randomNumberOfThree = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return startThreeAlpha + randomNumberOfThree;
}

export const createNewClient = asyncHandler(async (req, res, next) => {
    const { name, email, website } = req.body;

    if (!name || !email || !website) {
        throw new CustomError('All fields are required.', 200);
    }

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
        throw new CustomError('Client with this email already exists.', 200);
    }

    const uniqueId = generateUniqueId(name);

    const client = await Client.create({
        uniqueId,
        name,
        email,
        website,
        createdAt: Date.now(),
        isCookieApproved: false
    });

    res.status(200).json({
        success: true,
        client,
    });
})

export const getAllClients = asyncHandler(async (req, res, next) => {
    const clients = await Client.find();
    res.status(200).json({
        success: true,
        clients,
    });
})

export const updateClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, website } = req.body;

    if (!id) {
        throw new CustomError('Client ID is required.', 200);
    }

    const client = await Client.findById(id);
    if (!client) {
        throw new CustomError('Client not found.', 200);
    }

    client.name = name;
    client.email = email;
    client.website = website;
    client.updatedAt = Date.now();
    await client.save();

    res.status(200).json({
        success: true,
        message: 'Client updated successfully.',
        client,
    });
})

export const updatedCookieStatusAccept = asyncHandler(async (req, res, next) => {
    const { uniqueId } = req.body;

    if (!uniqueId) {
        throw new CustomError('Client ID is required.', 200);
    }

    const client = await Client.findOne({ uniqueId });

    if (!client) {
        throw new CustomError('Client not found.', 200);
    }

    client.isCookieApproved = true;
    client.updatedAt = Date.now();
    await client.save();

    res.status(200).json({
        success: true,
        message: 'Cookie status updated successfully.',
        client,
    });
})

export const updatedCookieStatusDeny = asyncHandler(async (req, res, next) => {
    const { uniqueId } = req.body;

    if (!uniqueId) {
        throw new CustomError('Client ID is required.', 200);
    }

    const client = await Client.findOne({ uniqueId });

    if (!client) {
        throw new CustomError('Client not found.', 200);
    }

    client.isCookieApproved = false;
    client.updatedAt = Date.now();
    await client.save();

    res.status(200).json({
        success: true,
        message: 'Cookie status updated successfully.',
        client,
    });
})


export const deleteClient = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        throw new CustomError('Client ID is required.', 200);
    }
    const client = await Client.findById(id);
    if (!client) {
        throw new CustomError('Client not found.', 200);
    }

    await client.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Client deleted successfully.',
    });
})