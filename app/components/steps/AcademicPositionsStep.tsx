"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  AcademicPositionCategory,
} from "./types";

export function AcademicPositionsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "academicPositions",
  });

  const positions = watch("academicPositions") || [];

  const addPosition = () => {
    append({
      id: crypto.randomUUID(),
      position: "PRORECTOR" as AcademicPositionCategory,
      unitName: "",
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (p: AcademicPositionCategory) => {
    switch (p) {
      case "PRORECTOR":
        return 10;
      case "DEAN":
        return 8;
      case "CHAIR_HEAD":
        return 8;
      case "RESEARCH_CENTER_HEAD":
        return 8;
      case "COORDINATOR":
        return 5;
      case "DEPARTMENT_HEAD":
        return 6;
      default:
        return 0;
    }
  };

  const total = positions.reduce(
    (s, p) => s + (p?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        XIV. Akademik və idarəetmə vəzifələri
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Vəzifə</label>
              <select
                {...register(
                  `academicPositions.${index}.position` as const,
                  {
                    onChange: (e) => {
                      const pos =
                        e.target.value as AcademicPositionCategory;
                      const p = calcPoints(pos);
                      setValue(
                        `academicPositions.${index}.position`,
                        pos
                      );
                      setValue(
                        `academicPositions.${index}.points`,
                        p
                      );
                    },
                  }
                )}
                className="border p-2 rounded"
              >
                <option value="PRORECTOR">Prorektor (10)</option>
                <option value="DEAN">Dekan (8)</option>
                <option value="CHAIR_HEAD">Kafedra müdiri (8)</option>
                <option value="RESEARCH_CENTER_HEAD">
                  Araşdırma mərkəzi müdiri (8)
                </option>
                <option value="COORDINATOR">Koordinator (5)</option>
                <option value="DEPARTMENT_HEAD">
                  Departament rəhbəri (6)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">Struktur bölmə</label>
              <input
                {...register(
                  `academicPositions.${index}.unitName` as const
                )}
                className="border p-2 rounded"
                placeholder="Fakültə / kafedra / mərkəz"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`academicPositions.${index}.year`, {
                  valueAsNumber: true,
                })}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-sm">
                Bal:{" "}
                <span className="font-semibold">
                  {positions[index]?.points ?? 0}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 text-sm"
          >
            Sil
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2 border-t">
        <button
          type="button"
          onClick={addPosition}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni vəzifə əlavə et
        </button>

        <p className="text-sm">
          Cəmi XIV balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}