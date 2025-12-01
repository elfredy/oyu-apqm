"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, ArtsAwardScope } from "./types";

export function ArtsAwardsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artsAwards",
  });

  const awards = watch("artsAwards") || [];

  const addAward = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      scope: "INTERNATIONAL" as ArtsAwardScope,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (scope: ArtsAwardScope) =>
    scope === "INTERNATIONAL" ? 10 : 5;

  const total = awards.reduce((s, a) => s + (a?.points || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        XVI. Sənətşünaslıq mükafatı
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Mükafat</label>
            <input
              {...register(`artsAwards.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Mükafatın adı"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Beynəlxalq / Yerli</label>
              <select
                {...register(`artsAwards.${index}.scope` as const, {
                  onChange: (e) => {
                    const scope =
                      e.target.value as ArtsAwardScope;
                    const p = calcPoints(scope);
                    setValue(
                      `artsAwards.${index}.scope`,
                      scope
                    );
                    setValue(`artsAwards.${index}.points`, p);
                  },
                })}
                className="border p-2 rounded"
              >
                <option value="INTERNATIONAL">
                  Beynəlxalq mükafat (10)
                </option>
                <option value="LOCAL">Yerli mükafat (5)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`artsAwards.${index}.year`, {
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
          + Yeni sənət mükafatı əlavə et
        </button>

        <p className="text-sm">
          Cəmi XIX balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}