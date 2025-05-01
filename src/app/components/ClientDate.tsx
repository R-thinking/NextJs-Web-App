"use client";
import { useState, useEffect } from "react";

export default function ClientDate({
  date,
  short = false,
}: {
  date: string;
  short?: boolean;
}) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const dateObj = new Date(date);

    // Always use YYYY-MM-DD format
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    setFormattedDate(`${year}-${month}-${day}`);
  }, [date, short]);

  return <>{formattedDate}</>;
}
