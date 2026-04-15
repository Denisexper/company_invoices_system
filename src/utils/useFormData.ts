import { useState } from "react";
import { type FormData, type LineItem, defaultFormData } from "./types";

export function useFormData() {
  const [formData, setFormData] = useState<FormData>({ ...defaultFormData });

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: keyof LineItem, value: string) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", details: "", price: "", qty: "1" }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return { formData, updateField, updateItem, addItem, removeItem };
}