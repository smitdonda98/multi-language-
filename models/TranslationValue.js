import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const TranslationValue = sequelize.define("TranslationValue", {
    translation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "translation_values",
    timestamps: false, // ✅ Disable timestamps
});

export default TranslationValue;

