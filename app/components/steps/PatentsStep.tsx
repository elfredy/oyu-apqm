"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, PatentCategory } from "./types";

export function PatentsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "patents",
  });

  const patents = watch("patents") || [];

  const addPatent = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      category: "PATENT" as PatentCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (cat: PatentCategory) => {
    switch (cat) {
      case "PATENT":
        return 20;
      case "INTERNATIONAL_IMPLEMENT":
        return 15;
      case "LOCAL_IMPLEMENT":
        return 10;
      default:
        return 0;
    }
  };

  const total = patents.reduce((s, p) => s + (p?.points || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">XII. Patent / yeni məhsul</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Patent / məhsul</label>
            <input
              {...register(`patents.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Patent və ya yeni məhsulun adı"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(`patents.${index}.category` as const, {
                  onChange: (e) => {
                    const cat = e.target.value as PatentCategory;
                    const p = calcPoints(cat);
                    setValue(`patents.${index}.category`, cat);
                    setValue(`patents.${index}.points`, p);
                  },
                })}
                className="border p-2 rounded"
              >
                <option value="PATENT">Patent / yeni məhsul (20)</option>
                <option value="INTERNATIONAL_IMPLEMENT">
                  Beynəlxalq qurumlarda tətbiq (15)
                </option>
                <option value="LOCAL_IMPLEMENT">
                  Yerli qurumlarda tətbiq (10)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`patents.${index}.year`, {
                  valueAsNumber: true,
                })}
                className="border p-2 rounded"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm">
              Bal:{" "}
              <span className="font-semibold">
                {patents[index]?.points ?? 0}
              </span>
            </p>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 text-sm"
            >
              Sil
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2 border-t">
        <button
          type="button"
          onClick={addPatent}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni patent/məhsul əlavə et
        </button>

        <p className="text-sm">
          Cəmi XII balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}