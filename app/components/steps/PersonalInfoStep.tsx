"use client";

import { UseFormReturn } from "react-hook-form";
import { ApqmFormValues } from "./types";

interface Props {
  form: UseFormReturn<ApqmFormValues>;
  onCheckFin?: () => void; // 🔥 yeni prop
}

export function PersonalInfoStep({ form, onCheckFin }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Şəxsi məlumatlar</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm">Universitet</label>
          <input
            {...register("personalInfo.university")}
            className="border p-2 rounded"
            readOnly
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Ad, soyad</label>
          <input
            {...register("personalInfo.fullName", { required: true })}
            className="border p-2 rounded"
            placeholder="Adınız və soyadınız"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Email</label>
          <input
            {...register("personalInfo.email", { required: true })}
            type="email"
            className="border p-2 rounded"
            placeholder="example@oyu.edu.az"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Cins</label>
          <select
            {...register("personalInfo.gender")}
            className="border p-2 rounded"
          >
            <option value="kisi">Kişi</option>
            <option value="qadin">Qadın</option>
            <option value="other">Digər</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm">İş ştatı</label>
          <select
            {...register("personalInfo.employmentType")}
            className="border p-2 rounded"
          >
            <option value="tam">Tam ştat</option>
            <option value="yarim">Yarım ştat</option>
            <option value="saat">Saat hesabı</option>
          </select>
        </div>

        {/* 🔥 FIN sahəsi + Yoxla düyməsi */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">FIN</label>
          <div className="flex gap-2">
            <input
              {...register("personalInfo.fin", {
                required: "FIN mütləqdir",
                minLength: {
                  value: 7,
                  message: "FIN ən azı 7 simvol olmalıdır",
                },
                maxLength: {
                  value: 10,
                  message: "FIN 10 simvoldan çox ola bilməz",
                },
              })}
              className="border p-2 rounded flex-1"
              placeholder="Məs: 1AB23C4 və ya 1234567"
            />
            {onCheckFin && (
              <button
                type="button"
                onClick={onCheckFin}
                className="px-3 py-2 text-xs md:text-sm rounded-md border border-blue-600 text-blue-700 hover:bg-blue-50"
              >
                FIN-i yoxla
              </button>
            )}
          </div>
          {errors.personalInfo?.fin && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.fin.message as string}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Əvvəl formu “Yadda saxla” etmisinizsə, FIN-i yazıb{" "}
            <span className="font-semibold">“FIN-i yoxla”</span> düyməsinə basın –
            sistem avtomatik olaraq əvvəlki məlumatları və qaldığınız stepi
            bərpa edəcək.
          </p>
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Elmi dərəcə</label>
          <select
            {...register("personalInfo.degree")}
            className="border p-2 rounded"
          >
            <option value="doktor">Elmlər doktoru</option>
            <option value="phd">PhD</option>
            <option value="magistr">Magistr</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Elmi vəzifə</label>
          <select
            {...register("personalInfo.position")}
            className="border p-2 rounded"
          >
            <option value="dosent">Dosent</option>
            <option value="dosent_phd">Dosent PhD</option>
            <option value="professor">Professor</option>
            <option value="professor_phd">Professor PhD</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Kafedra</label>
          <input
            {...register("personalInfo.department")}
            className="border p-2 rounded"
            placeholder="Kafedranın adı"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Fakültə</label>
          <input
            {...register("personalInfo.faculty")}
            className="border p-2 rounded"
            placeholder="Fakültənin adı"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Araşdırma mərkəzi</label>
          <input
            {...register("personalInfo.researchCenter")}
            className="border p-2 rounded"
            placeholder="(əgər varsa)"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Akademik il</label>
          <input
            {...register("personalInfo.academicYear")}
            className="border p-2 rounded"
            placeholder="2024-2025"
          />
        </div>
      </div>
    </div>
  );
}