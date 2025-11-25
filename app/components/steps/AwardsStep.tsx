"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, AwardCategory } from "./types";

export function AwardsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, getValues, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  const awards = watch("awards") || [];

  const addAward = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      category: "best_paper" as AwardCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcAwardPoints = (category: AwardCategory) => {
    switch (category) {
      case "best_paper":
        return 5;
      case "training_certificate_international":
        return 3;
      case "training_certificate_local":
        return 2;
      case "best_article_local":
        return 3;
      case "outstanding_researcher":
        return 5;
      case "oyu_excellence":
        return 5;
      default:
        return 0;
    }
  };

  const recalcAwardPoints = (index: number) => {
    const category = getValues(
      `awards.${index}.category` as const
    ) as AwardCategory;

    const pts = calcAwardPoints(category);
    setValue(`awards.${index}.points`, pts);
  };

  const totalAwardPoints = awards.reduce(
    (sum, a) => sum + (a?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">VIII. Mükafatlar və təltiflər</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Mükafatın adı</label>
            <input
              {...register(`awards.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Məs: Best Paper Award, təlim sertifikatı və s."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(`awards.${index}.category` as const, {
                  onChange: () => recalcAwardPoints(index),
                })}
                className="border p-2 rounded"
              >
                <option value="best_paper">
                  Beynəlxalq konfrans “Best Paper Award” (5 bal)
                </option>
                <option value="training_certificate_international">
                  Beynəlxalq qurumlardan təlim sertifikatı (3 bal)
                </option>
                <option value="training_certificate_local">
                  Yerli qurumlardan təlim sertifikatı (2 bal)
                </option>
                <option value="best_article_local">
                  Yerli qurumlarda “Ən yaxşı məqalə” (3 bal)
                </option>
                <option value="outstanding_researcher">
                  OYU Görkəmli Elmi tədqiqatçı diplomu mükafatı (5 bal)
                </option>
                <option value="outstanding_researcher">
                  OYU Elmi tədqiqatçı diplomu mükafatı (4 bal)
                </option>
                <option value="oyu_excellence">
                  OYU “İşində fərqliliyə görə” təltifi (5 bal)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`awards.${index}.year`, {
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
                {awards[index]?.points ?? 0}
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
          onClick={addAward}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni mükafat əlavə et
        </button>

        <p className="text-sm">
          Cəmi mükafat balı:{" "}
          <span className="font-semibold">
            {totalAwardPoints.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}