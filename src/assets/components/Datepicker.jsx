// src/components/Datepicker.jsx
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Datepicker({ price = 0, onTotalChange = () => {} }) {
  const [checkIn, setCheckIn] = useState(null);   // dayjs object or null
  const [checkOut, setCheckOut] = useState(null); // dayjs object or null

  const today = dayjs().startOf("day");
  const yearEnd = dayjs().endOf("year");

  useEffect(() => {
    if (checkIn && checkOut) {
      // calculate nights (ensure non-negative)
      const nights = Math.max(0, checkOut.diff(checkIn, "day"));
      const total = nights * Number(price || 0);

      // send plain values (ISO strings) so parent components get serializable values
      onTotalChange({
        nights,
        total,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });
    } else {
      // reset when either date missing
      onTotalChange({ nights: 0, total: 0, checkIn: null, checkOut: null });
    }
  }, [checkIn, checkOut, price, onTotalChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <DatePicker
          label="Check-In"
          value={checkIn}
          minDate={today}
          maxDate={yearEnd}
          onChange={(date) => {
            // date is a dayjs object (or null)
            setCheckIn(date);
            // if checkOut is before new checkIn, reset it
            if (checkOut && date && checkOut.isSameOrBefore(date, "day")) {
              setCheckOut(null);
            }
          }}
          renderInput={(params) => <input className="form-control" {...params} />}
        />

        <DatePicker
          label="Check-Out"
          value={checkOut}
          minDate={checkIn ? checkIn.add(1, "day") : today}
          maxDate={yearEnd}
          onChange={(date) => setCheckOut(date)}
          disabled={!checkIn}
          renderInput={(params) => <input className="form-control" {...params} />}
        />
      </div>
    </LocalizationProvider>
  );
}
//ezekiel