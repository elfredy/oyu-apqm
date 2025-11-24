"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  ProjectType,
  ProjectRole,
} from "./types";

interface Props {
  form: UseFormReturn<ApqmFormValues>;
}

// Cədvələ görə bal hesablayan helper
// III. LAYİHƏ
// A  Beynəlxalq layihədə sədr/icraçı/koordinator  12/10/8
// B  Yerli   layihədə sədr/icraçı/koordinator  10/8/6
function getProjectPoints(type: ProjectType, role: ProjectRole): number {
  if (type === "INTERNATIONAL") {
    if (role === "CHAIR") return 12;
    if (role === "EXECUTOR") return 10;
    if (role === "COORDINATOR") return 8;
  } else {
    // LOCAL
    if (role === "CHAIR") return 10;
    if (role === "EXECUTOR") return 8;
    if (role === "COORDINATOR") return 6;
  }
  return 0;
}

export function ProjectsStep({ form }: Props) {
  const { control, register, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const projects = watch("projects") || [];

  const addProject = () => {
    const defaultType: ProjectType = "INTERNATIONAL";
    const defaultRole: ProjectRole = "COORDINATOR";
    const p = getProjectPoints(defaultType, defaultRole);

    append({
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      type: defaultType,
      role: defaultRole,
      year: new Date().getFullYear(),
      points: p,
    });
  };

  const handleTypeOrRoleChange = (
    index: number,
    field: "type" | "role",
    value: ProjectType | ProjectRole,
  ) => {
    const current = projects[index];

    const newType =
      field === "type"
        ? (value as ProjectType)
        : (current?.type ?? "INTERNATIONAL");

    const newRole =
      field === "role"
        ? (value as ProjectRole)
        : (current?.role ?? "COORDINATOR");

    const newPoints = getProjectPoints(newType, newRole);

    // react-hook-form dəyərlərini yenilə
    setValue(`projects.${index}.type`, newType);
    setValue(`projects.${index}.role`, newRole);
    setValue(`projects.${index}.points`, newPoints);
  };

  const totalProjectPoints = projects.reduce(
    (sum, p) => sum + (p.points || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">III. Layihələr</h2>

      {fields.length === 0 && (
        <p className="text-sm text-slate-600">
          Hazırda əlavə olunmuş layihə yoxdur. Aşağıdakı düymə ilə layihə
          əlavə edə bilərsiniz.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-sm">Layihənin adı</label>
            <input
              {...register(`projects.${index}.title`)}
              className="border p-2 rounded"
              placeholder="Layihənin tam adı"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm">Qurum / təşkilat</label>
            <input
              {...register(`projects.${index}.organization`)}
              className="border p-2 rounded"
              placeholder="Məs: Erasmus+, Horizon, yerli fond və s."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Layihə tipi</label>
              <select
                {...register(`projects.${index}.type` as const)}
                className="border p-2 rounded"
                onChange={(e) =>
                  handleTypeOrRoleChange(
                    index,
                    "type",
                    e.target.value as ProjectType,
                  )
                }
              >
                <option value="INTERNATIONAL">
                  Beynəlxalq layihə
                </option>
                <option value="LOCAL">Yerli layihə</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">Rolu</label>
              <select
                {...register(`projects.${index}.role` as const)}
                className="border p-2 rounded"
                onChange={(e) =>
                  handleTypeOrRoleChange(
                    index,
                    "role",
                    e.target.value as ProjectRole,
                  )
                }
              >
                <option value="CHAIR">Sədr</option>
                <option value="EXECUTOR">İcraçı</option>
                <option value="COORDINATOR">Koordinator</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm">İl</label>
              <input
                type="number"
                {...register(`projects.${index}.year`, {
                  valueAsNumber: true,
                })}
                className="border p-2 rounded"
              />
            </div>
          </div>

          <p className="text-sm">
            Bu layihə üçün bal:{" "}
            <span className="font-semibold">
              {projects[index]?.points ?? 0}
            </span>
          </p>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 text-sm"
          >
            Layihəni sil
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
      >
        + Yeni layihə əlavə et
      </button>

      {projects.length > 0 && (
        <div className="pt-2 border-t mt-4 text-sm">
          <span className="font-medium">Layihələr üzrə ümumi bal: </span>
          <span className="font-semibold">
            {totalProjectPoints.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}