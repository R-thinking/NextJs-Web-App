"use client";
import { useState, useEffect } from "react";

export default function ClientDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString());
  }, [date]);

  return <>{formattedDate}</>;
}
