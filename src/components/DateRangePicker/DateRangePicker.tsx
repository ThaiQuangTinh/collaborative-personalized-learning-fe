import React, { useEffect, useState } from "react";
import "./DateRangePicker.css";
import InputDate from "../InputDate/InputDate";
import FormLabel from "../FormLabel/FormLabel";

interface DateRangePickerProps {
    label?: string;
    startDate: string;
    endDate: string;
    startDateLabel: string;
    endDateLabel: string;
    onChange?: (range: { startDate: string; endDate: string }) => void;
    editable?: boolean;
    backgroundColor?: string;
    fontSize?: string;
    borderColor?: string;
    required?: boolean;
}

const normalizeDate = (value: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    label = "Thời gian",
    startDate,
    endDate,
    startDateLabel,
    endDateLabel,
    onChange,
    editable = false,
    backgroundColor = "#f9f9f9",
    fontSize = "15px",
    borderColor = "#d0d7de",
    required = false,
}) => {
    const [range, setRange] = useState({
        startDate: normalizeDate(startDate),
        endDate: normalizeDate(endDate),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...range, [name]: value };
        setRange(updated);
        onChange?.(updated);
    };

    // Sync from parent → child
    useEffect(() => {
        setRange({
            startDate: normalizeDate(startDate),
            endDate: normalizeDate(endDate),
        });
    }, [startDate, endDate, editable]);

    return (
        <div
            className="date-range-container"
            style={{
                backgroundColor,
                border: `1px solid ${borderColor}`,
                fontSize,
            }}
        >
            {!editable ? (
                <p className="date-range-display">
                    <span>Thời gian: </span>
                    {range.startDate
                        ? new Date(range.startDate).toLocaleDateString("vi-VN")
                        : "__ / __ / ____"}
                    {" - "}
                    {range.endDate
                        ? new Date(range.endDate).toLocaleDateString("vi-VN")
                        : "__ / __ / ____"}
                </p>
            ) : (
                <div className="date-range-edit">
                    <div className="date-range-group">
                        <FormLabel
                            text={startDateLabel}
                            required={required}
                            fontSize={fontSize}
                        />
                        <InputDate
                            name="startDate"
                            value={range.startDate}
                            onChange={handleChange}
                            fontSize={fontSize}
                        />
                    </div>

                    <div className="date-range-group">
                        <FormLabel
                            text={endDateLabel}
                            required={required}
                            fontSize={fontSize}
                        />
                        <InputDate
                            name="endDate"
                            value={range.endDate}
                            onChange={handleChange}
                            fontSize={fontSize}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
