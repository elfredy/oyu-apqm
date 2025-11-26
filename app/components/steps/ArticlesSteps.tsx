"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ApqmFormValues, ArticleCategory } from "./types";

interface Props {
  form: UseFormReturn<ApqmFormValues>;
}

// Kateqoriyaya görə baza balı
const getArticleBasePoints = (category: ArticleCategory): number => {
  switch (category) {
    case "A_WOS_AHCI_SCI_SSCI":
      return 20;
    case "B_SCOPUS":
      return 20;
    case "C_WOS_ESCI":
      return 15;
    case "D_WOS_CPCI_FULL":
      return 15;
    case "D_WOS_CPCI_ABSTRACT":
      return 5;
    case "E_OTHER_INDEXED":
      return 7;
    case "F_AAK_JOURNAL":
      return 5;
    default:
      return 0;
  }
};

// Müəllif əmsalı
const getAuthorCoefficient = (authorCount: number): number => {
  if (!authorCount || authorCount <= 0) return 0;
  if (authorCount === 1) return 1;
  if (authorCount === 2) return 0.6;
  if (authorCount === 3) return 0.4;
  return 0.2; // 4 və daha çox
};

export function ArticlesStep({ form }: Props) {
  const { register, control, watch, setValue, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "articles",
  });

  const articles = watch("articles") || [];

  const addArticle = () => {
    append({
      id: crypto.randomUUID(),
      title: "",
      journal: "",
      category: "A_WOS_AHCI_SCI_SSCI" as ArticleCategory,
      year: new Date().getFullYear(),
      authorCount: 1,
      basePoints: 0,
      authorCoefficient: 0,
      points: 0,
    });
  };

  const recalcArticle = (index: number) => {
    const article = getValues(`articles.${index}`);
    if (!article) return;

    const category = article.category as ArticleCategory;
    const basePoints = getArticleBasePoints(category);

    const authorCountNum = Number(article.authorCount) || 0;
    const coef = getAuthorCoefficient(authorCountNum);
    const points = basePoints * coef;

    setValue(`articles.${index}.basePoints`, basePoints);
    setValue(`articles.${index}.authorCoefficient`, coef);
    setValue(`articles.${index}.points`, points);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">II. Məqalələr</h2>

      {fields.length === 0 && (
        <p className="text-sm text-slate-600">
          İlk məqaləni əlavə etmək üçün aşağıdakı düymədən istifadə edin.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-lg bg-slate-50 space-y-3"
        >
          {/* Başlıq */}
          <div className="flex flex-col">
            <label className="text-sm">Məqalənin adı</label>
            <input
              {...register(`articles.${index}.title` as const)}
              className="border p-2 rounded"
              placeholder="Məqalənin tam adı"
            />
          </div>

          {/* Jurnal */}
          <div className="flex flex-col">
            <label className="text-sm">Jurnal / mənbə</label>
            <input
              {...register(`articles.${index}.journal` as const)}
              className="border p-2 rounded"
              placeholder="Jurnalın adı"
            />
          </div>

          {/* Kateqoriya */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm">İndekslənmə</label>
              <select
                {...register(`articles.${index}.category` as const, {
                  onChange: () => recalcArticle(index),
                })}
                className="border p-2 rounded"
              >
                <option value="A_WOS_AHCI_SCI_SSCI">
                  A — WoS AHCI/SCI/SSCI (20 bal)
                </option>
                <option value="B_SCOPUS">
                  B — Scopus jurnalı (20 bal)
                </option>
                <option value="C_WOS_ESCI">
                  C — WoS ESCI (15 bal)
                </option>
                <option value="D_WOS_CPCI_FULL">
                  D — WoS CPCI tam mətn (15 bal)
                </option>
                <option value="D_WOS_CPCI_ABSTRACT">
                  D — WoS CPCI xülasə (5 bal)
                </option>
                <option value="E_OTHER_INDEXED">
                  E — Digər indeksli jurnallar (7 bal)
                </option>
                <option value="F_AAK_JOURNAL">
                  F — AAK tərəfindən qəbul edilən jurnal (5 bal)
                </option>
              </select>
            </div>

            {/* İl + müəllif sayı */}
            <div className="flex flex-col flex-1">
              <label className="text-sm">Nəşr ili</label>
              <input
                type="number"
                {...register(`articles.${index}.year` as const, {
                  valueAsNumber: true,
                })}
                className="border p-2 rounded"
                placeholder="2024"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm">Müəllif sayı</label>
              <input
                type="number"
                min={1}
                {...register(
                  `articles.${index}.authorCount` as const,
                  {
                    valueAsNumber: true,
                    onChange: () => recalcArticle(index),
                  }
                )}
                className="border p-2 rounded"
                placeholder="Məs: 1, 2, 3..."
              />
            </div>
          </div>

          {/* Bal xülasəsi */}
          <div className="text-xs text-slate-700 space-y-1 mt-2">
            <p>
              Baza balı:{" "}
              <span className="font-semibold">
                {articles[index]?.basePoints ?? 0}
              </span>
            </p>
            <p>
              Müəllif əmsalı:{" "}
              <span className="font-semibold">
                {articles[index]?.authorCoefficient ?? 0}
              </span>
            </p>
            <p>
              Yekun bal (sistem):{" "}
              <span className="font-semibold">
                {articles[index]?.points ?? 0}
              </span>
            </p>
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

      <button
        type="button"
        onClick={addArticle}
        className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
      >
        + Yeni məqalə əlavə et
      </button>
    </div>
  );
}