"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  DissertationCategory,
} from "./types";

export function DissertationsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dissertations",
  });

  const dissertations = watch("dissertations") || [];

  const addDissertation = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      category: "PHD_SUPERVISION" as DissertationCategory,
      year: new Date().getFullYear(),
      points: 0,
    });
  };

  const calcPoints = (cat: DissertationCategory) => {
    switch (cat) {
      case "PHD_SUPERVISION":
        return 7;
      case "DEFENDED_PHD":
        return 10;
      case "DEFENDED_DOCTORAL":
        return 20;
      case "ACADEMIC_TITLE_DOCENT":
        return 8;
      case "ACADEMIC_TITLE_PROFESSOR":
        return 10;
      case "MASTER_SUPERVISION":
        return 2;
      case "PHD_STUDENT":
        return 5;
      default:
        return 0;
    }
  };

  const total = dissertations.reduce(
    (sum, d) => sum + (d?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">IX. Dissertasiya</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Mövzu / rəhbərlik</label>
            <input
              {...register(`dissertations.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Dissertasiya mövzusu və ya rəhbərlik etdiyiniz iş"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Kateqoriya</label>
              <select
                {...register(
                  `dissertations.${index}.category` as const,
                  {
                    onChange: (e) => {
                      const cat = e.target.value as DissertationCategory;
                      const p = calcPoints(cat);
                      setValue(
                        `dissertations.${index}.category`,
                        cat
                      );
                      setValue(`dissertations.${index}.points`, p);
                    },
                  }
                )}
                className="border p-2 rounded"
              >
                <option value="PHD_SUPERVISION">
                  Cari ildə tamamlanmış PhD dissertasiyasına rəhbərlik (7)
                </option>
                <option value="DEFENDED_PHD">
                  Cari ildə PhD dissertasiyasını müdafiə edib (10)
                </option>
                <option value="DEFENDED_DOCTORAL">
                  Cari ildə Elmlər doktoru dissertasiyasını müdafiə edib (20)
                </option>
                <option value="ACADEMIC_TITLE_DOCENT">
                  Cari ildə dosent elmi ünvanı alıb (8)
                </option>
                <option value="ACADEMIC_TITLE_PROFESSOR">
                  Cari ildə professor elmi ünvanı alıb (10)
                </option>
                <option value="MASTER_SUPERVISION">
                  Cari ildə tamamlanmış magistr işinə rəhbərlik (2) (max 10 bal)
                </option>
                <option value="PHD_STUDENT">
                  PHD təhsil alan (5)
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`dissertations.${index}.year`, {
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
                {dissertations[index]?.points ?? 0}
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
          onClick={addDissertation}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          + Yeni dissertasiya aktivliyi əlavə et
        </button>

        <p className="text-sm">
          Cəmi IX balı:{" "}
          <span className="font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}