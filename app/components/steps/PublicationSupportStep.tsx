"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  ApqmFormValues,
  TranslationType,
  EditorialType,
} from "./types";

export function PublicationSupportStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { control, register, watch, setValue } = form;

  // Tərcümə
  const {
    fields: translationFields,
    append: appendTranslation,
    remove: removeTranslation,
  } = useFieldArray({
    control,
    name: "translations",
  });

  // Redaktorluq / rəyçilik
  const {
    fields: editorialFields,
    append: appendEditorial,
    remove: removeEditorial,
  } = useFieldArray({
    control,
    name: "editorialReviews",
  });

  const translations = watch("translations") || [];
  const editorialReviews = watch("editorialReviews") || [];

  const calcTranslationPoints = (type: TranslationType): number => {
    switch (type) {
      case "book":
        return 10; // Kitab
      case "chapter":
        return 5; // Kitab fəsli
      default:
        return 0;
    }
  };

  const calcEditorialPoints = (type: EditorialType): number => {
    switch (type) {
      case "editor_wos_scopus":
        return 15;
      case "editor_other_international":
        return 7;
      case "editor_local":
        return 5;
      case "reviewer_wos_scopus":
        return 5;
      case "reviewer_other_international":
        return 4;
      case "reviewer_local":
        return 3;
      case "reviewer_textbook":
        // Dərslik üçün 5, proqram üçün 2 idi – ortanı 5 kimi götürürük
        return 5;
      case "reviewer_program":
        // Dərslik üçün 5, proqram üçün 2 idi – ortanı 5 kimi götürürük
        return 2;
      case "reviewer_oyu_journal":
        return 3;
      case "reviewer_phd":
        return 5;
      case "reviewer_master":
        return 3;
      case "reviewer_bachalor":
        return 2;
      default:
        return 0;
    }
  };

  const addTranslation = () => {
    const defaultType: TranslationType = "book";
    appendTranslation({
      id: crypto.randomUUID(),
      title: "",
      type: defaultType,
      year: new Date().getFullYear(),
      points: calcTranslationPoints(defaultType),
    });
  };

  const addEditorial = () => {
    const defaultType: EditorialType = "editor_wos_scopus";
    appendEditorial({
      id: crypto.randomUUID(),
      title: "",
      type: defaultType,
      year: new Date().getFullYear(),
      points: calcEditorialPoints(defaultType),
    });
  };

  const handleTranslationTypeChange = (
    index: number,
    value: TranslationType
  ) => {
    const pts = calcTranslationPoints(value);
    setValue(`translations.${index}.type`, value, { shouldDirty: true });
    setValue(`translations.${index}.points`, pts, { shouldDirty: true });
  };

  const handleEditorialTypeChange = (
    index: number,
    value: EditorialType
  ) => {
    const pts = calcEditorialPoints(value);
    setValue(`editorialReviews.${index}.type`, value, { shouldDirty: true });
    setValue(`editorialReviews.${index}.points`, pts, { shouldDirty: true });
  };

  const totalTranslationPoints = translations.reduce(
    (sum, t) => sum + (t?.points || 0),
    0
  );

  const totalEditorialPoints = editorialReviews.reduce(
    (sum, e) => sum + (e?.points || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Tərcümə */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">VI. Tərcümə fəaliyyəti</h2>

        {translationFields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-lg bg-slate-50 space-y-3"
          >
            <div className="flex flex-col">
              <label className="text-sm">Əsərin adı</label>
              <input
                {...register(`translations.${index}.title` as const)}
                className="border p-2 rounded"
                placeholder="Kitab və ya fəsilin adı"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-sm">Tip</label>
                <select
                  {...register(`translations.${index}.type` as const)}
                  className="border p-2 rounded"
                  onChange={(e) =>
                    handleTranslationTypeChange(
                      index,
                      e.target.value as TranslationType
                    )
                  }
                >
                  <option value="book">Kitab (10 bal)</option>
                  <option value="chapter">Kitab fəsli (5 bal)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm">İl</label>
                <input
                  type="number"
                  {...register(`translations.${index}.year`, {
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
                  {translations[index]?.points ?? 0}
                </span>
              </p>

              <button
                type="button"
                onClick={() => removeTranslation(index)}
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
            onClick={addTranslation}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          >
            + Yeni tərcümə əlavə et
          </button>

          <p className="text-sm">
            Cəmi tərcümə balı:{" "}
            <span className="font-semibold">
              {totalTranslationPoints.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      {/* Redaktorluq / rəyçilik */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          VII. Redaktorluq və rəyçilik
        </h2>

        {editorialFields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-lg bg-slate-50 space-y-3"
          >
            <div className="flex flex-col">
              <label className="text-sm">
                Nəşrin / jurnalın / əsərin adı
              </label>
              <input
                {...register(`editorialReviews.${index}.title` as const)}
                className="border p-2 rounded"
                placeholder="Jurnal, kitab və ya dissertasiya"
              />
            </div> 

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-sm">Kateqoriya</label>
                <select
                  {...register(
                    `editorialReviews.${index}.type` as const
                  )}
                  className="border p-2 rounded"
                  onChange={(e) =>
                    handleEditorialTypeChange(
                      index,
                      e.target.value as EditorialType
                    )
                  }
                >
                  <option value="editor_wos_scopus">
                    WoS/Scopus jurnalda redaktorluq (15 bal)
                  </option>
                  <option value="editor_other_international">
                    Digər beynəlxalq nəşrdə redaktorluq (7 bal)
                  </option>
                  <option value="editor_local">
                    Yerli nəşrdə redaktorluq (5 bal)
                  </option>
                  <option value="reviewer_wos_scopus">
                    WoS/Scopus jurnalda rəyçi (5 bal)
                  </option>
                  <option value="reviewer_other_international">
                    Digər beynəlxalq nəşrdə rəyçi (4 bal)
                  </option>
                  <option value="reviewer_local">
                    Yerli nəşriyyatda rəyçi (3 bal)
                  </option>
                  <option value="reviewer_textbook">
                    Tədris vəsaitinə rəyçi (5 bal)
                  </option>
                  <option value="reviewer_program">
                    Fənn proqramına rəyçi (2 bal)
                  </option>
                  <option value="reviewer_oyu_journal">
                    OYU “Elmi və Pedaqoji xəbərlər” jurnalında rəyçi (3 bal)
                  </option>
                  <option value="reviewer_phd">
                   OYU - da PhD dissertasiyasına rəyçi (5 bal)
                  </option>
                  <option value="reviewer_master">
                    Magistr dissertasiyasına rəyçi (3 bal)
                  </option>
                  <option value="reviewer_master">
                    Bakalavr dissertasiyasına rəyçi (3 bal)
                  </option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm">İl</label>
                <input
                  type="number"
                  {...register(`editorialReviews.${index}.year`, {
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
                  {editorialReviews[index]?.points ?? 0}
                </span>
              </p>

              <button
                type="button"
                onClick={() => removeEditorial(index)}
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
            onClick={addEditorial}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          >
            + Yeni redaktorluq/rəyçilik əlavə et
          </button>

          <p className="text-sm">
            Cəmi redaktorluq/rəyçilik balı:{" "}
            <span className="font-semibold">
              {totalEditorialPoints.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}