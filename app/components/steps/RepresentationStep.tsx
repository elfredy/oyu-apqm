"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  RepresentationScope,
} from "./types";

export function RepresentationStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "representations",
  });

  const reps = watch("representations") || [];

  const addRep = () => {
    append({
      id: crypto.randomUUID(),
      organization: "",
      scope: "INTERNATIONAL" as RepresentationScope,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (scope: RepresentationScope) =>
    scope === "INTERNATIONAL" ? 5 : 3;

  const total = reps.reduce((s, r) => s + (r?.points || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">XIII. OYU-nu təmsil etmə (Maksimum 10 bal)</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Qurum / tədbir</label>
            <input
              {...register(
                `representations.${index}.organization` as const
              )}
              className="border p-2 rounded"
              placeholder="Məs: UNESCO tədbiri"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Beynəlxalq / Yerli</label>
              <select
                {...register(
                  `representations.${index}.scope` as const,
                  {
                    onChange: (e) => {
                      const scope =
                        e.target.value as RepresentationScope;
                      const p = calcPoints(scope);
                      setValue(
                        `representations.${index}.scope`,
                        scope
                      );
                      setValue(
                        `representations.${index}.points`,
                        p
                      );
                    },
                  }
                )}
                className="border p-2 rounded"
              >
                <option value="INTERNATIONAL">
                  Beynəlxalq təmsilçilik (5)
                </option>
                <option value="LOCAL">
                  Yerli təmsilçilik (3)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`representations.${index}.year`, {
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
                {reps[index]?.points ?? 0}
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
          onClick={addRep}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni təmsilçilik əlavə et
        </button>

        <p className="text-sm">
          Cəmi XIII balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}