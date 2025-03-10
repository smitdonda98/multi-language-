"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Inputlanguage = () => {
    const [grid, setGrid] = useState([
        [{ id: 1, language: "English", value: "", translations: {} }],
    ]);
    const [firstRowLanguages, setFirstRowLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/load");

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched data:", data);

                    // Ensure unique IDs when setting the grid
                    const updatedGrid = data.grid.map(row =>
                        row.map(field => ({ ...field, id: uuidv4() }))
                    );

                    setGrid(updatedGrid || [[{ id: uuidv4(), language: "English", value: "", translations: {} }]]);
                    setFirstRowLanguages(data.firstRowLanguages || ["English"]);
                } else {
                    console.error("Failed to load data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const languages = ["English", "Spanish", "French", "Hindi", "Chinese", "Arabic"];

    const translate = (text, targetLanguage) => {
        return text;
    };

    const handleAddToRow = () => {
        setGrid((prevGrid) =>
            prevGrid.map((row) => [
                ...row,
                { id: uuidv4(), language: "English", value: "", translations: {} },
            ])
        );
    };

    const handleAddToColumn = () => {
        setGrid((prevGrid) => {
            const columnWidth = prevGrid[0].length;
            const firstRowLanguages = prevGrid[0].map(field => field.language);

            const newRow = Array.from({ length: columnWidth }).map((_, colIdx) => ({
                id: uuidv4(),
                language: firstRowLanguages[colIdx],
                value: "",
                translations: {},
            }));

            return [...prevGrid, newRow];
        });
    };

    const handleFieldChange = (rowIdx, colIdx, value) => {
        setGrid((prevGrid) =>
            prevGrid.map((row, rIdx) =>
                row.map((field, cIdx) => {
                    if (rIdx === rowIdx && cIdx === colIdx) {
                        return { ...field, value };
                    }
                    return field;
                })
            )
        );
    };

    const handleLanguageChange = (colIdx, language) => {
        setGrid((prevGrid) =>
            prevGrid.map((row) =>
                row.map((field, cIdx) => {
                    if (cIdx === colIdx) {
                        return { ...field, language };
                    }
                    return field;
                })
            )
        );
    };

    const handleDeleteColumn = (colIdx, setFieldValue, values) => {
        setGrid((prevGrid) =>
            prevGrid.map((row) => row.filter((_, cIdx) => cIdx !== colIdx))
        );

        const updatedLanguages = values.firstRowLanguages.filter((_, idx) => idx !== colIdx);
        setFieldValue("firstRowLanguages", updatedLanguages);
    };

    const validationSchema = Yup.object().shape({
        grid: Yup.array().of(
            Yup.array().of(
                Yup.object().shape({
                    value: Yup.string().required("This field is required."),
                })
            )
        ).test("no-duplicate-values", "Duplicate values are not allowed in the same language column.", function (grid) {
            if (!grid || grid.length === 0) return true;

            const columnCount = grid[0].length;
            for (let colIdx = 0; colIdx < columnCount; colIdx++) {
                const language = grid[0][colIdx].language;
                if (language === "English") {
                    const valuesSet = new Set();
                    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
                        const value = grid[rowIdx][colIdx].value?.trim().toLowerCase();
                        if (value && valuesSet.has(value)) {
                            return this.createError({ path: `grid[${rowIdx}][${colIdx}].value`, message: "Duplicate value found" });
                        }
                        valuesSet.add(value);
                    }
                }
            }
            return true;
        }),
        firstRowLanguages: Yup.array()
            .test("unique-languages", "Each language must be unique.", (languages) => {
                const uniqueLanguages = new Set(languages);
                return uniqueLanguages.size === languages.length;
            })
            .required("Languages are required."),
    });

    const handleSubmit = async (values) => {
        const payload = {
            grid: values.grid,
            firstRowLanguages: values.firstRowLanguages,
        };
        try {
            const response = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Data saved successfully!");
            } else {
                alert("Failed to save data.");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("An error occurred.");
        }
    };



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Multilingual Input Fields</h1>

            <Formik
                initialValues={{
                    grid,
                    firstRowLanguages: grid[0].map((field) => field.language),
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="space-y-4 overflow-auto">
                            {values.grid.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex gap-4">
                                    {row.map((field, colIdx) => (
                                        <div key={field.id} className="flex flex-col space-y-2">
                                            {rowIdx === 0 && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <select
                                                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={field.language}
                                                        onChange={(e) => {
                                                            const newLanguage = e.target.value;
                                                            handleLanguageChange(colIdx, newLanguage);
                                                            const updatedLanguages = [...values.firstRowLanguages];
                                                            updatedLanguages[colIdx] = newLanguage;
                                                            setFieldValue("firstRowLanguages", updatedLanguages);
                                                        }}
                                                    >
                                                        {languages.map((lang) => (
                                                            <option key={lang} value={lang}>
                                                                {lang}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteColumn(colIdx, setFieldValue, values)
                                                        }
                                                        className="p-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}

                                            <Field
                                                name={`grid[${rowIdx}][${colIdx}].value`}
                                                placeholder={`Type in ${field.language}...`}
                                                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={field.value}
                                                onChange={(e) => {
                                                    handleFieldChange(rowIdx, colIdx, e.target.value);
                                                    setFieldValue(
                                                        `grid[${rowIdx}][${colIdx}].value`,
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                            <ErrorMessage
                                                name={`grid[${rowIdx}][${colIdx}].value`}
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleAddToRow}
                                    className="p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Row ➡️
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddToColumn}
                                    className="p-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Column ⬇️
                                </button>
                            </div>
                            <ErrorMessage
                                name={`firstRowLanguages`}
                                component="div"
                                className="text-red-500 text-sm"
                            />

                            <button
                                type="submit"
                                className="p-2 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Inputlanguage;
