"use client";
import { useState, useEffect } from "react";

export default function ClientDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    setFormattedDate(`${year}-${month}-${day}`);
  }, [date]);

  return <>{formattedDate}</>;
}
