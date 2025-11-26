"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, SeminarCategory } from "./types";

export function SeminarsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "seminars",
  });

  const seminars = watch("seminars") || [];

  const addSeminar = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      category: "speaker" as SeminarCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPointsByCategory = (category: SeminarCategory): number => {
    switch (category) {
      case "speaker":                 // Məruzəçi
        return 4;
      case "participant":             // İştirakçı (məruzəsiz)
        return 2;
      case "moderator":               // Moderator
        return 3;
      case "oyu_internal_speaker":    // OYU elmi-metodiki seminar – məruzəçi
        return 8;
      case "oyu_internal_participant":// OYU elmi-metodiki seminar – iştirakçı
        return 2;
      default:
        return 0;
    }
  };

  const handleCategoryChange = (index: number, category: SeminarCategory) => {
    const pts = calcPointsByCategory(category);
    setValue(`seminars.${index}.points`, pts);
  };

  const totalSeminarPoints = seminars.reduce(
    (sum, s) => sum + (s?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        V. Seminar 
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Tədbirin adı</label>
            <input
              {...register(`seminars.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Seminar "
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Rolu</label>
              <select
                {...register(`seminars.${index}.category` as const, {
                  onChange: (e) =>
                    handleCategoryChange(
                      index,
                      e.target.value as SeminarCategory
                    ),
                })}
                className="border p-2 rounded"
              >
                <option value="speaker">Məruzəçi</option>
                <option value="participant">İştirakçı (məruzəsiz)</option>
                <option value="moderator">Moderator</option>
                <option value="oyu_internal_speaker">
                OYU kafedralarda davamlı elmi seminar – məruzəçi
                </option>
                <option value="oyu_internal_participant">
                  OYU elmi-metodiki seminar – iştirakçı
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`seminars.${index}.year`, {
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
                {seminars[index]?.points ?? 0}
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
          onClick={addSeminar}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni seminar əlavə et
        </button>

        <p className="text-sm">
          Cəmi seminar balı:{" "}
          <span className="font-semibold">
            {totalSeminarPoints.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}