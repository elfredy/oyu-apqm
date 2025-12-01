"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, JuryCategory } from "./types";

export function JuryStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "juries",
  });

  const juries = watch("juries") || [];

  const addJury = () => {
    append({
      id: crypto.randomUUID(),
      eventName: "",
      category: "INTL_CHAIR" as JuryCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (cat: JuryCategory) => {
    switch (cat) {
      case "INTL_CHAIR":
        return 8;
      case "LOCAL_CHAIR":
        return 5;
      case "INTL_MEMBER":
        return 5;
      case "LOCAL_MEMBER":
        return 3;
      default:
        return 0;
    }
  };

  const total = juries.reduce((s, j) => s + (j?.points || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">XI. Jüri  (Maksimum 10 bal)</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Müsabiqə / tədbir</label>
            <input
              {...register(`juries.${index}.eventName` as const)}
              className="border p-2 rounded"
              placeholder="Müsabiqənin adı"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(`juries.${index}.category` as const, {
                  onChange: (e) => {
                    const cat = e.target.value as JuryCategory;
                    const p = calcPoints(cat);
                    setValue(`juries.${index}.category`, cat);
                    setValue(`juries.${index}.points`, p);
                  },
                })}
                className="border p-2 rounded"
              >
                <option value="INTL_CHAIR">
                  Beynəlxalq müsabiqə – Sədr (8)
                </option>
                <option value="LOCAL_CHAIR">
                  Yerli müsabiqə – Sədr (5)
                </option>
                <option value="INTL_MEMBER">
                  Beynəlxalq müsabiqə – Üzv (5)
                </option>
                <option value="LOCAL_MEMBER">
                  Yerli müsabiqə – Üzv (3)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`juries.${index}.year`, {
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
                {juries[index]?.points ?? 0}
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
          onClick={addJury}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni jüri fəaliyyəti əlavə et
        </button>

        <p className="text-sm">
          Cəmi XI balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}