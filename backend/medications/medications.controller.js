import { createMedication, getMedicationsByFirstLetter, getMedicationById, updateMedicationById, deleteMedicationById, addReview, getReviews } from "./medications.model.js";
import path from 'path';
import { ErrorResponse } from "../error.js";

export const add_medication = async (req, res, next) => {
    try {
        const tokenData = JSON.parse(req.body.tokenData);
        if (!tokenData) {
            throw new Error("Token data is missing");
        }

        const { name, generic_name, medication_class, availability } = req.body;

        const newMedication = {
            medicationId: new Date().toISOString(),
            name,
            generic_name,
            medication_class,
            availability,
            first_letter: name[0].toUpperCase(),
            added_by: {
                user_id: tokenData._id,
                fullname: tokenData.fullname,
                email: tokenData.email,
            },
            images: req.files.map(file => ({ filename: file.filename, originalname: file.originalname })),
            reviews: [],
        };

        const results = await createMedication(newMedication);
        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Error creating medication:", error);
        res.status(500).json({ success: false, message: error.message });
        next(error);
    }
};

export const get_medications_by_first_letter = async (req, res, next) => {
    try {
        const { first_letter = "A" } = req.query;
        const results = await getMedicationsByFirstLetter(first_letter);
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

export const get_medication_by_id = async (req, res, next) => {
    try {
        const { medication_id } = req.params;
        const results = await getMedicationById(medication_id);
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

export const update_medication_by_id = async (req, res, next) => {
    try {
        const { medication_id } = req.params;
        const { tokenData, name, generic_name, medication_class, availability } = req.body;

        let parsedTokenData = JSON.parse(tokenData);
        const query = { name, generic_name, medication_class, availability, first_letter: name[0].toUpperCase() };

        if (req.file) {
            const { originalname, filename } = req.file;
            query.images = { filename, originalname };
        }

        const results = await updateMedicationById(medication_id, query);
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

export const delete_medication_by_id = async (req, res, next) => {
    try {
        const { medication_id } = req.params;
        const { tokenData } = req.body;
        let parsedTokenData = JSON.parse(tokenData);

        await deleteMedicationById(medication_id);
        res.json({ success: true, data: true });
    } catch (error) {
        next(error);
    }
};

export const add_reviews = async (req, res, next) => {
    try {
        const { medication_id } = req.params;
        const { tokenData, review, rating } = req.body;

        const newReview = {
            _id: new Date().toISOString(),
            review,
            rating,
            by: { user_id: tokenData._id, fullname: tokenData.fullname },
            date: Date.now(),
        };

        const results = await addReview(medication_id, newReview);
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

export const get_reviews = async (req, res, next) => {
    try {
        const { medication_id } = req.params;
        const results = await getReviews(medication_id);
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};
