"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  ArtsActivityCategory,
} from "./types";

export function ArtsActivityStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artsActivities",
  });

  const activities = watch("artsActivities") || [];

  const addActivity = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      category: "INTL_SOLO" as ArtsActivityCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (cat: ArtsActivityCategory) => {
    switch (cat) {
      case "INTL_SOLO":
        return 20;
      case "INTL_GROUP":
        return 16;
      case "LOCAL_SOLO":
        return 19;
      case "LOCAL_GROUP":
        return 6;
      default:
        return 0;
    }
  };

  const total = activities.reduce(
    (s, a) => s + (a?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        XVII. Sənətşünaslıq fəaliyyəti
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Sərgi / fəaliyyət</label>
            <input
              {...register(`artsActivities.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Sərginin/fəaliyyətin adı"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(
                  `artsActivities.${index}.category` as const,
                  {
                    onChange: (e) => {
                      const cat =
                        e.target.value as ArtsActivityCategory;
                      const p = calcPoints(cat);
                      setValue(
                        `artsActivities.${index}.category`,
                        cat
                      );
                      setValue(`artsActivities.${index}.points`, p);
                    },
                  }
                )}
                className="border p-2 rounded"
              >
                <option value="INTL_SOLO">
                  Beynəlxalq fərdi sərgi (20)
                </option>
                <option value="INTL_GROUP">
                  Beynəlxalq qarışıq sərgi (16)
                </option>
                <option value="LOCAL_SOLO">
                  Yerli fərdi sərgi (10)
                </option>
                <option value="LOCAL_GROUP">
                  Yerli qarışıq sərgi (6)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`artsActivities.${index}.year`, {
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
                {activities[index]?.points ?? 0}
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
          onClick={addActivity}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni fəaliyyət əlavə et
        </button>

        <p className="text-sm">
          Cəmi XVII balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}