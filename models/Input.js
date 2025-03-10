import mongoose from "mongoose";

const InputSchema = new mongoose.Schema({
    grid: [
        [
            {
                id: { type: String, required: true },
                language: { type: String, required: true },
                value: { type: String, required: true },
            },
        ],
    ],
    firstRowLanguages: {
        type: Array,
        required: true,
    },
});

export default mongoose.models.Input || mongoose.model("Input", InputSchema);
