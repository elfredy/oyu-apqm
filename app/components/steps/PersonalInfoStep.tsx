"use client";

import { UseFormReturn } from "react-hook-form";
import { ApqmFormValues } from "./types";

interface Props {
  form: UseFormReturn<ApqmFormValues>;
}

export function PersonalInfoStep({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Şəxsi məlumatlar</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Universitet */}
        <div className="flex flex-col">
          <label className="text-sm">Universitet</label>
          <input
            {...register("personalInfo.university")}
            className="border p-2 rounded bg-slate-100"
            readOnly
          />
        </div>

        {/* Ad, soyad */}
        <div className="flex flex-col">
          <label className="text-sm">Ad, soyad</label>
          <input
            {...register("personalInfo.fullName", {
              required: "Ad, soyad mütləqdir",
            })}
            className={`border p-2 rounded ${
              errors.personalInfo?.fullName ? "border-red-500" : ""
            }`}
            placeholder="Adınız və soyadınız"
          />
          {errors.personalInfo?.fullName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.fullName.message as string}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm">Email</label>
          <input
            {...register("personalInfo.email", {
              required: "Email mütləqdir",
            })}
            type="email"
            className={`border p-2 rounded ${
              errors.personalInfo?.email ? "border-red-500" : ""
            }`}
            placeholder="example@oyu.edu.az"
          />
          {errors.personalInfo?.email && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.email.message as string}
            </p>
          )}
        </div>

        {/* Cins */}
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

        {/* İş ştatı */}
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

        {/* FIN */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">FIN</label>
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
            className={`border p-2 rounded ${
              errors.personalInfo?.fin ? "border-red-500" : ""
            }`}
            placeholder="Məs: 1AB23C4 və ya 1234567"
          />
          {errors.personalInfo?.fin && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.fin.message as string}
            </p>
          )}
        </div>

        {/* Elmi dərəcə */}
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

        {/* Elmi vəzifə */}
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

        {/* Kafedra */}
        <div className="flex flex-col">
          <label className="text-sm">Kafedra</label>
          <input
            {...register("personalInfo.department", {
              required: "Kafedra adı mütləqdir",
            })}
            className={`border p-2 rounded ${
              errors.personalInfo?.department ? "border-red-500" : ""
            }`}
            placeholder="Kafedranın adı"
          />
          {errors.personalInfo?.department && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.department.message as string}
            </p>
          )}
        </div>

        {/* Fakültə */}
        <div className="flex flex-col">
          <label className="text-sm">Fakültə</label>
          <input
            {...register("personalInfo.faculty", {
              required: "Fakültə adı mütləqdir",
            })}
            className={`border p-2 rounded ${
              errors.personalInfo?.faculty ? "border-red-500" : ""
            }`}
            placeholder="Fakültənin adı"
          />
          {errors.personalInfo?.faculty && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.faculty.message as string}
            </p>
          )}
        </div>

        {/* Araşdırma mərkəzi (optional) */}
        <div className="flex flex-col">
          <label className="text-sm">Araşdırma mərkəzi</label>
          <input
            {...register("personalInfo.researchCenter")}
            className="border p-2 rounded"
            placeholder="(əgər varsa)"
          />
        </div>

        {/* Akademik il */}
        <div className="flex flex-col">
          <label className="text-sm">Akademik il</label>
          <input
            {...register("personalInfo.academicYear", {
              required: "Akademik il mütləqdir",
            })}
            className={`border p-2 rounded ${
              errors.personalInfo?.academicYear ? "border-red-500" : ""
            }`}
            placeholder="2024-2025"
          />
          {errors.personalInfo?.academicYear && (
            <p className="text-xs text-red-600 mt-1">
              {errors.personalInfo.academicYear.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}