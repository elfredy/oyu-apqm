"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Stepper } from "./components/Stepper";

import { PersonalInfoStep } from "./components/steps/PersonalInfoStep";
import BookStep from "./components/steps/BookStep";
import { ArticlesStep } from "./components/steps/ArticlesSteps";
import { ProjectsStep } from "./components/steps/ProjectsStep";
import { ConferencesStep } from "./components/steps/ConferencesStep";
import { SeminarsStep } from "./components/steps/SeminarsStep";
import { PublicationSupportStep } from "./components/steps/PublicationSupportStep";
import { AwardsStep } from "./components/steps/AwardsStep";
import { DissertationsStep } from "./components/steps/DissertationsStep";
import { AcademicBodiesStep } from "./components/steps/AcademicBodiesStep";
import { JuryStep } from "./components/steps/JuryStep";
import { PatentsStep } from "./components/steps/PatentsStep";
import { RepresentationStep } from "./components/steps/RepresentationStep";
import { AcademicPositionsStep } from "./components/steps/AcademicPositionsStep";
import { ArtsActivityStep } from "./components/steps/ArtsActivityStep";
import { ArtsAwardsStep } from "./components/steps/ArtsAwardsStep";
import { OpenQuestionsStep } from "./components/steps/OpenQuestionsStep";
import {CertificatesStep} from './components/steps/CertificatesStep'

import { ApqmFormValues } from "./components/steps/types";
import { db } from "./lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const STEPS = [
  "Şəxsi məlumatlar", // 0
  "Kitablar", // 1
  "Məqalələr", // 2
  "Layihələr", // 3
  "Konfranslar", // 4
  "Seminar / sosial fəaliyyət", // 5
  "Tərcümə, redaktorluq, rəyçilik", // 6
  "Mükafatlar", // 7
  "Dissertasiyalar", // 8
  "Elmi şuralar və təşkilatlar", // 9
  "Jüri", //10
  "Patent / yeni məhsul", //11
  "OYU-nu təmsil etmə", //12
  "Akademik və idarəetmə vəzifələri", //13
  "Sənətşünaslıq fəaliyyəti", //14
  "Sənətşünaslıq mükafatı", //15
  "Sertifikatlar",
  "Açıq Suallar ", //17
  "Yekun", //18
];

// Hər step üçün hansı sahələri validate edək?
const STEP_FIELDS: Record<number, string[]> = {
  0: [
    "personalInfo.fullName",
    "personalInfo.email",
    "personalInfo.fin",
    "personalInfo.department",
    "personalInfo.faculty",
    "personalInfo.academicYear",
  ],
  1: ["books"],                // array – varsa içindəkilər yoxlanacaq
  2: ["articles"],
  3: ["projects"],
  4: ["conferences"],
  5: ["seminars"],
  6: ["translations", "editorialReviews"],
  7: ["awards"],
  8: ["dissertations"],
  9: ["academicBodies"],
  10: ["juries"],
  11: ["patents"],
  12: ["representations"],
  13: ["academicPositions"],
  14: ["artsActivities"],
  15: ["artsAwards"],
  16: ["certificates"],
  17: [], // açıq sualları məcburi etmirsənsə boş qala bilər
};

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const form = useForm<ApqmFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      personalInfo: {
        university: "Odlar Yurdu Universiteti",
        fullName: "",
        email: "",
        gender: "kisi",
        employmentType: "tam",
        degree: "phd",
        position: "dosent_phd",
        department: "",
        faculty: "",
        researchCenter: "",
        academicYear: "",
        fin: "",
      },
      books: [],
      articles: [],
      // digər massivlər useFieldArray ilə gələcək
    },
  });

  const { handleSubmit, watch, trigger } = form;

  const articles = watch("articles") || [];
  const books = watch("books") || [];

  const totalArticlePoints = articles.reduce(
    (sum, a) => sum + (a.points || 0),
    0
  );
  const totalBookPoints = books.reduce((sum, b) => sum + (b.points || 0), 0);
  const grandTotal = totalArticlePoints + totalBookPoints;

  // Bir stepi keçməzdən əvvəl yalnız ona aid sahələri validate edirik
  const validateStep = async (stepIndex: number) => {
    const fields = STEP_FIELDS[stepIndex];
    if (!fields || fields.length === 0) {
      // Bu step üçün xüsusi məcburi sahə yoxdursa – direkt true
      return true;
    }
    const isValid = await trigger(fields as any, { shouldFocus: true });

    setErrorSteps((prev) => {
      const set = new Set(prev);
      if (!isValid) set.add(stepIndex);
      else set.delete(stepIndex);
      return Array.from(set);
    });

    return isValid;
  };

  const handleNext = async () => {
    const ok = await validateStep(currentStep);
    if (!ok) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleStepChange = async (targetIndex: number) => {
    if (targetIndex === currentStep) return;
    // çıxarkən hazırki stepi validate edək
    const ok = await validateStep(currentStep);
    if (!ok) return;
    setCurrentStep(targetIndex);
  };

  const onSubmit = async (values: ApqmFormValues) => {
    console.log("SUBMIT START", values); // 🔍
    setIsSubmitting(true);
    try {
      const res = await addDoc(collection(db, "apqmSubmissions"), {
        ...values,
        totalArticlePoints,
        totalBookPoints,
        grandTotalPoints: grandTotal,
        createdAt: serverTimestamp(),
      });
      console.log("FIRESTORE OK, DOC ID:", res.id);
      setSubmitDone(true);
    } catch (error) {
      console.error("Submit error FIREBASE ===>", error);
      alert("Yükləmədə problem oldu, console-a baxaq.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="flex items-center gap-4">
        <img src="/logo.jpeg" alt="OYU" className="w-40" />
        <h1 className="text-3xl font-bold">
          OYU Akademik Performans Qiymətləndirmə Formu
        </h1>
      </div>

      <p className="text-md text-center text-slate-600 mb-6">
        Hər akademik ilin sonunda akademik heyət tərəfindən doldurulur.
      </p>

      <Stepper
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        errorSteps={errorSteps}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {currentStep === 0 && <PersonalInfoStep form={form} />}
        {currentStep === 1 && <BookStep form={form} />}
        {currentStep === 2 && <ArticlesStep form={form} />}
        {currentStep === 3 && <ProjectsStep form={form} />}
        {currentStep === 4 && <ConferencesStep form={form} />}
        {currentStep === 5 && <SeminarsStep form={form} />}
        {currentStep === 6 && <PublicationSupportStep form={form} />}
        {currentStep === 7 && <AwardsStep form={form} />}
        {currentStep === 8 && <DissertationsStep form={form} />}
        {currentStep === 9 && <AcademicBodiesStep form={form} />}
        {currentStep === 10 && <JuryStep form={form} />}
        {currentStep === 11 && <PatentsStep form={form} />}
        {currentStep === 12 && <RepresentationStep form={form} />}
        {currentStep === 13 && <AcademicPositionsStep form={form} />}
        {currentStep === 14 && <ArtsActivityStep form={form} />}
        {currentStep === 15 && <ArtsAwardsStep form={form} />}
        {currentStep === 16 && <CertificatesStep form={form} />}
        {currentStep === 17 && <OpenQuestionsStep form={form} />}


        {currentStep === STEPS.length - 1 && (
          <div className="space-y-4">
            <h2 className="text-6xl my-10 font-semibold text-center">
              Diqqət
            </h2>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border">
              <button
                type="button"
                onClick={() => setConfirmChecked((v) => !v)}
                className={`
                  mt-1 w-5 h-5 rounded border flex items-center justify-center
                  ${confirmChecked ? "bg-green-600 border-green-600" : "border-slate-400"}
                `}
              >
                {confirmChecked && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              <p className="text-sm text-slate-800">
                Əlavə etdiyim məlumatların doğruluğunu təsdiq edirəm və
                yanlış məlumat verdiyim halda məsuliyyət daşıdığımı və balımın sıfırlanacağını 
                qəbul edirəm.
              </p>
            </div>

            <p className="text-md text-red-600">
              <span className="font-semibold">Qeyd:</span> Xahiş olunur formu
              göndərməzdən əvvəl əlavə etdiyiniz məlumatları bir daha
              diqqətlə yoxlayasınız.
            </p>

            {submitDone && (
              <p className="text-sm text-green-700">
                Məlumatlar uğurla göndərildi. Təşəkkür edirik!
              </p>
            )}
          </div>
        )}

        {/* Navigasiya düymələri */}
        <div className="flex justify-between pt-4 border-t mt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
          >
            Geri
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white"
            >
              Növbəti
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !confirmChecked}
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Göndərilir..." : "Göndər"}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}