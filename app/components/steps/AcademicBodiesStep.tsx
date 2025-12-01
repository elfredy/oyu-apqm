"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  AcademicBodyCategory,
} from "./types";

export function AcademicBodiesStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "academicBodies",
  });

  const bodies = watch("academicBodies") || [];

  const addBody = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      category: "AAK_COUNCIL_CHAIR" as AcademicBodyCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (cat: AcademicBodyCategory) => {
    switch (cat) {
      case "AAK_COUNCIL_CHAIR":
        return 10;
      case "AAK_COUNCIL_MEMBER":
        return 5;
      case "SEMINAR_CHAIR":
        return 6;
      case "SEMINAR_MEMBER":
        return 3;
      case "BACHELOR_COMMISSION":
        return 3;
      case "MASTER_COMMISSION_CHAIR":
        return 3;
      case "MASTER_COMMISSION_MEMBER":
        return 2;
      case "PHD_DEFENSE_CHAIR":
        return 4;
      case "PHD_DEFENSE_MEMBER":
        return 3;
      default:
        return 0;
    }
  };

  const total = bodies.reduce((sum, b) => sum + (b?.points || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        X. Elmi/ixtisas yönlü qurumlar, elmi şura və təşkilatlar 
      </h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Şura / təşkilat</label>
            <input
              {...register(`academicBodies.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Məs: AAK Dissertasiya Şurası"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(
                  `academicBodies.${index}.category` as const,
                  {
                    onChange: (e) => {
                      const cat = e.target.value as AcademicBodyCategory;
                      const p = calcPoints(cat);
                      setValue(
                        `academicBodies.${index}.category`,
                        cat
                      );
                      setValue(`academicBodies.${index}.points`, p);
                    },
                  }
                )}
                className="border p-2 rounded"
              >
                <option value="AAK_COUNCIL_CHAIR">
                  AAK təsdiqli dissertasiya şurası – sədri (10)
                </option>
                <option value="AAK_COUNCIL_MEMBER">
                  AAK dissertasiya şurası – üzvü (5)
                </option>
                <option value="SEMINAR_CHAIR">
                  Dissertasiya şurası nəzdində seminar – sədri (6)
                </option>
                <option value="SEMINAR_MEMBER">
                  Dissertasiya şurası nəzdində seminar – üzvü (3)
                </option>
                <option value="BACHELOR_COMMISSION">
                  OYU bakalavriat buraxılış işi komissiyası (3)
                </option>
                <option value="MASTER_COMMISSION_CHAIR">
                  Magistr dissertasiya komissiyası – sədri (3)
                </option>
                <option value="MASTER_COMMISSION_MEMBER">
                  Magistr dissertasiya komissiyası – üzvü (2)
                </option>
                <option value="PHD_DEFENSE_CHAIR">
                  OYU PhD müdafiə komissiyası – sədri (4)
                </option>
                <option value="PHD_DEFENSE_MEMBER">
                  OYU PhD müdafiə komissiyası – üzvü (3)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`academicBodies.${index}.year`, {
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
                {bodies[index]?.points ?? 0}
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
          onClick={addBody}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni şura/təşkilat əlavə et
        </button>

        <p className="text-sm">
          Cəmi X balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}