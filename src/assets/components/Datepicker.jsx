import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function Date({ price, onTotalChange }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const today = dayjs().startOf("day");
  const yearEnd = dayjs().endOf("year");

  useEffect(() => {
    if (checkIn && checkOut) {
      const nights = checkOut.diff(checkIn, 'day');
      const total = nights * price;
      onTotalChange({ nights, total, checkIn, checkOut });
    }
  }, [checkIn, checkOut, price, onTotalChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: "flex", gap: 10 }}>
        <DatePicker
          label="Check-In"
          value={checkIn}
          minDate={today}
          maxDate={yearEnd}
          onChange={(date) => setCheckIn(date)}
        />
        <DatePicker
          label="Check-Out"
          value={checkOut}
          minDate={checkIn ? checkIn.add(1, "day") : today}
          maxDate={yearEnd}
          onChange={(date) => setCheckOut(date)}
          disabled={!checkIn}
        />
      </div>
    </LocalizationProvider>
  );
}

export default Date;
