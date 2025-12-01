"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, BookCategory } from "./types";

export default function BookStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { register, control, watch, getValues, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "books",
  });

  const books = watch("books") || [];

  const getBasePointsForCategory = (category: BookCategory): number => {
    switch (category) {
      case "A_TOP_PUBLISHER":
        return 30;
      case "B_WOS_SCOPUS_BOOK_SERIES":
        return 20;
      case "C_HIGH_RATED_LOCAL":
        return 5;
      case "D_CHAPTER_INTL":
        return 10;
      case "D_CHAPTER_LOCAL":
        return 5;
      case "E_TEXTBOOK":
        return 7;
      case "D_CHAPTER_LOCAL":
        return 5;
      case "F_COURSE_P":
        return 4;
      default:
        return 0;
    }
  };

  const getCoefficientForAuthorCount = (count: number): number => {
    if (!count || count <= 1) return 1;   // 1 müəllif – tam bal
    if (count === 2) return 0.6;
    if (count === 3) return 0.4;
    return 0.2;                           // 3-dən çox – 0.2
  };

  const recalcBookPoints = (index: number) => {
    const category = getValues(`books.${index}.category`) as BookCategory;
    const authorCountRaw = getValues(`books.${index}.authorCount`) as number | undefined;
    const authorCount = authorCountRaw && authorCountRaw > 0 ? authorCountRaw : 1;

    const basePoints = getBasePointsForCategory(category);
    const authorCoefficient = getCoefficientForAuthorCount(authorCount);
    const points = basePoints * authorCoefficient;

    setValue(`books.${index}.basePoints`, basePoints);
    setValue(`books.${index}.authorCoefficient`, authorCoefficient);
    setValue(`books.${index}.points`, points);
  };

  const addBook = () => {
    const defaultCategory: BookCategory = "A_TOP_PUBLISHER";
    const basePoints = getBasePointsForCategory(defaultCategory);
    const authorCoefficient = 1;
    const points = basePoints * authorCoefficient;

    append({
      id: crypto.randomUUID(),
      title: "",
      publisher: "",
      category: defaultCategory,
      year: new Date().getFullYear(),
      authorCount: 1,
      basePoints,
      authorCoefficient,
      points,
    });
  };

  const totalBookPoints = books.reduce(
    (sum, b) => sum + (b?.points || 0),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">II. Kitablar</h2>

      {fields.map((field, index) => {
        const bookPoints = books[index]?.points ?? 0;

        return (
          <div
            key={field.id}
            className="border p-4 rounded-lg bg-slate-50 space-y-3"
          >
            <div className="flex flex-col">
              <label className="text-sm">Kitabın adı</label>
              <input
                {...register(`books.${index}.title`)}
                className="border p-2 rounded"
                placeholder="Kitab adı"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm">Nəşriyyat linki</label>
              <input
                {...register(`books.${index}.publisher`)}
                className="border p-2 rounded"
                placeholder="Nəşriyyatın linki"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col">
                <label className="text-sm">Nəşriyyatın adı</label>
                <select
                  {...register(`books.${index}.category` as const)}
                  className="border p-2 rounded"
                  onChange={(e) => {
                    const val = e.target.value as BookCategory;
                    setValue(`books.${index}.category`, val);
                    recalcBookPoints(index);
                  }}
                >
                  <option value="A_TOP_PUBLISHER">
                    A – Pearson, Springer, Elsevier və s. (30 bal)
                  </option>
                  <option value="B_WOS_SCOPUS_BOOK_SERIES">
                    B – WoS/Scopus book series (20 bal)
                  </option>
                  <option value="C_HIGH_RATED_LOCAL">
                    C – Az/Türkiyə/MDB yüksək reytinq (5 bal)
                  </option>
                  <option value="D_CHAPTER_INTL">
                    D – Beynəlxalq kitab fəsli (10 bal)
                  </option>
                  <option value="D_CHAPTER_LOCAL">
                    D – Oyu Elmi şuradan keçmiş  (5 bal)
                  </option>
                  <option value="E_TEXTBOOK">
                    E – Dərslik (7 bal)
                  </option>
                  <option value="D_CHAPTER_LOCAL">
                    F – Dərs vəsaiti, Monoqrafiya  (5 bal)
                  </option>
                  <option value="F_COURSE_P">
                    E – Fənn programı  (4 bal)
                  </option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm">Nəşr ili</label>
                <input
                  type="number"
                  {...register(`books.${index}.year`, {
                    valueAsNumber: true,
                  })}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm">Müəllif sayı</label>
                <input
                  type="number"
                  min={1}
                  {...register(`books.${index}.authorCount`, {
                    valueAsNumber: true,
                  })}
                  className="border p-2 rounded"
                  onChange={(e) => {
                    const val = Number(e.target.value || 1);
                    setValue(`books.${index}.authorCount`, val);
                    recalcBookPoints(index);
                  }}
                />
              </div>
            </div>

            {/* Hər kitab üçün bal – ArticlesStep-dəki kimi göstəririk */}
            <p className="text-sm">
              Bu kitab üçün bal:{" "}
              <span className="font-semibold">
                {bookPoints.toFixed(2)}
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
        );
      })}

      <button
        type="button"
        onClick={addBook}
        className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
      >
        + Yeni kitab əlavə et
      </button>

      {/* ArticlesStep-dəki kimi ümumi kitab balı */}
      <div className="mt-4 border-t pt-3 text-sm">
        <p>
          Ümumi kitab balı:{" "}
          <span className="font-semibold">
            {totalBookPoints.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}