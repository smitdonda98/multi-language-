// import { DataTypes } from "sequelize";
// import sequelize from "../lib/sequelize"; // Import DB connection

// const Translation = sequelize.define("Translation", {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     english: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     spanish: {
//         type: DataTypes.TEXT,
//     },
//     french: {
//         type: DataTypes.TEXT,
//     },
//     hindi: {
//         type: DataTypes.TEXT,
//     },
//     chinese: {
//         type: DataTypes.TEXT,
//     },
//     arabic: {
//         type: DataTypes.TEXT,
//     },
// }, {
//     tableName: "translations",
//     timestamps: false,
// });

// export default Translation;


import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const Translation = sequelize.define("Translation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps: false,
});

export default Translation;
