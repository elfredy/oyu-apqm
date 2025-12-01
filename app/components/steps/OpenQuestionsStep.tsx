"use client";

import { UseFormReturn } from "react-hook-form";
import { ApqmFormValues } from "./types";

export function OpenQuestionsStep({
  form,
}: {
  form: UseFormReturn<ApqmFormValues>;
}) {
  const { register } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">XVIII. Açıq suallar</h2>

      <div className="flex flex-col space-y-2">
        <label className="text-sm">
          A. Akademik performansınızdan məmnunsunuzmu?
        </label>
        <textarea
          {...register("openResponses.satisfaction")}
          className="border p-2 rounded min-h-[80px]"
          placeholder="Fikirlərinizi qeyd edin..."
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm">
          B. Cari ildə elm və təhsil sahəsində ən böyük nailiyyətiniz nədir?
        </label>
        <textarea
          {...register("openResponses.biggestAchievement")}
          className="border p-2 rounded min-h-[80px]"
          placeholder="Ən böyük nailiyyətinizi təsvir edin..."
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm">
          C. Gələn il üçün elm və təhsildə öncəlikləriniz nədir?
        </label>
        <textarea
          {...register("openResponses.nextYearPriorities")}
          className="border p-2 rounded min-h-[80px]"
          placeholder="Plan və öncəliklərinizi qeyd edin..."
        />
      </div>
    </div>
  );
}