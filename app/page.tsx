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
import { CertificatesStep } from "./components/steps/CertificatesStep";

import { ApqmFormValues } from "./components/steps/types";
import { db } from "./lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const STEPS = [
  "Şəxsi məlumatlar", // 0
  "Kitablar", // 1  (I)
  "Məqalələr", // 2  (II)
  "Layihələr", // 3  (III)
  "Konfranslar", // 4  (IV)
  "Seminar / sosial fəaliyyət", // 5  (V)
  "Tərcümə, redaktorluq, rəyçilik", // 6  (VI–VII)
  "Mükafatlar", // 7  (VIII)
  "Dissertasiyalar", // 8  (IX)
  "Elmi şuralar və təşkilatlar", // 9  (X)
   "Jüri",//10  (XI)
  "Patent / yeni məhsul", //11  (XII)
  "OYU-nu təmsil etmə", //12  (XIII)
  "Akademik və idarəetmə vəzifələri", //13 (XIV)
  "Sənətşünaslıq fəaliyyəti",
   //14  (XVII)
  "Sənətşünaslıq mükafatı", //15  (XIX)
  "Sertifikatlar", //16  (extra step)
  "Açıq suallar", //17  (XX)
  "Yekun", //18
];

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const [savingDraft, setSavingDraft] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const form = useForm<ApqmFormValues>({
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
      projects: [],
      conferences: [],
      seminars: [],
      translations: [],
      editorialReviews: [],
      awards: [],
      dissertations: [],
      academicBodies: [],
      juries: [],
      patents: [],
      representations: [],
      academicPositions: [],
      artsActivities: [],
      artsAwards: [],
      certificates: [],
      openQuestions: {
        satisfaction: "",
        biggestAchievement: "",
        nextYearPriorities: "",
      },
    },
  });

  const {
    handleSubmit,
    watch,
    getValues,
    reset,
  } = form;

  const articles = watch("articles") || [];
  const books = watch("books") || [];

  const totalArticlePoints = articles.reduce(
    (sum, a) => sum + (a.points || 0),
    0
  );
  const totalBookPoints = books.reduce((sum, b) => sum + (b.points || 0), 0);
  const grandTotal = totalArticlePoints + totalBookPoints;

  // 🔍 FIN-i əl ilə yoxlama funksiyası
  const handleCheckFin = async () => {
    const values = getValues();
    const trimmedFin = (values.personalInfo.fin || "").trim();
  
    if (!trimmedFin || trimmedFin.length < 5) {
      alert("Zəhmət olmasa düzgün FIN daxil edin (minimum 5 simvol).");
      return;
    }
  
    try {
      setAlreadySubmitted(false);
  
      // 1) artıq submit olunubmu?
      const submissionsQ = query(
        collection(db, "apqmSubmissions"),
        where("personalInfo.fin", "==", trimmedFin)
      );
      const submissionsSnap = await getDocs(submissionsQ);
  
      if (!submissionsSnap.empty) {
        setAlreadySubmitted(true);
        alert(
          "Bu FIN ilə APQM formu artıq tam şəkildə göndərilib. Təkrar doldurmaq mümkün deyil."
        );
        setCurrentStep(STEPS.length - 1);
        return;
      }
  
      // 2) draft varmı?
      const draftRef = doc(db, "apqmDrafts", trimmedFin);
      const draftSnap = await getDoc(draftRef);
  
      if (draftSnap.exists()) {
        const data = draftSnap.data() as ApqmFormValues & {
          currentStep?: number;
        };
  
        reset(data);
        const stepFromDraft =
          typeof data.currentStep === "number" ? data.currentStep : 0;
        setCurrentStep(stepFromDraft);
  
        alert(
          "Əvvəlki yadda saxlanılmış məlumatlar tapıldı və form bərpa olundu."
        );
      } else {
        alert(
          "Bu FIN üçün yadda saxlanmış məlumat tapılmadı. Yeni form kimi davam edə bilərsiniz."
        );
      }
    } catch (err: any) {
      console.error("FIN yoxlanışında xəta:", err);
      alert(
        `FIN yoxlanarkən xəta baş verdi. Detal: ${
          err?.message || "naməlum xəta"
        }`
      );
    }
  };

  // 🟦 Draft yadda saxla
  const handleSaveDraft = async () => {
    const values = getValues();
    const trimmedFin = (values.personalInfo.fin || "").trim();

    if (!trimmedFin) {
      alert("Yadda saxlamaq üçün əvvəl FIN daxil edin.");
      return;
    }

    try {
      setSavingDraft(true);

      await setDoc(
        doc(db, "apqmDrafts", trimmedFin),
        {
          ...values,
          currentStep,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Məlumatlar uğurla yadda saxlanıldı.");
    } catch (err) {
      console.error("Draft save error:", err);
      alert("Yadda saxlanarkən xəta baş verdi.");
    } finally {
      setSavingDraft(false);
    }
  };

  // ✅ Nəticəni göndər
  const onSubmit = async (values: ApqmFormValues) => {
    if (alreadySubmitted) {
      alert(
        "Bu FIN ilə form artıq göndərilib. Təkrar göndərmək mümkün deyil."
      );
      return;
    }

    if (!confirmChecked) {
      alert(
        "Xahiş olunur məlumatların doğruluğunu təsdiq edən checkbox-u işarələyin."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "apqmSubmissions"), {
        ...values,
        totalArticlePoints,
        totalBookPoints,
        grandTotalPoints: grandTotal,
        createdAt: serverTimestamp(),
      });

      // Draftı sil
      const trimmedFin = (values.personalInfo.fin || "").trim();
      if (trimmedFin) {
        await deleteDoc(doc(db, "apqmDrafts", trimmedFin)).catch(() => {});
      }

      console.log("Form submitted, id:", docRef.id);
      setSubmitDone(true);
      setAlreadySubmitted(true);
      alert("Form uğurla göndərildi.");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Yükləmədə problem oldu, sonra yenidən yoxlayın.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
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

      <p className="text-lg  text-center text-slate-600 mb-8">
        Hər akademik ilin sonunda akademik heyət tərəfindən doldurulur.
        <br />
        Formanı doldurduqdan sonra "Yadda saxla" düyməsinə basmağı unutmayın!
      </p>

      <Stepper
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={(index) => setCurrentStep(index)}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {currentStep === 0 && (
          <PersonalInfoStep form={form} onCheckFin={handleCheckFin} />
        )}
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
          <div className="space-y-6">
            <h2 className="text-5xl my-4  text-red-600 font-semibold text-center">
              Diqqət !!!
            </h2>

            <div className="flex items-start gap-3 p-4 border rounded-lg bg-slate-50">
              <input
                id="confirm"
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="confirm"
                className="text-lg text-slate-800 leading-snug"
              >
                Formada təqdim etdiyim bütün məlumatların doğru və aktual
                olduğunu təsdiq edirəm. Yalan və ya yanlış məlumat verdiyim
                təqdirdə məsuliyyət daşıyacağıma və nəticələrimin sıfırlanacağını təsdiq edirəm
              </label>
            </div>

            {submitDone && (
              <p className="text-sm text-green-700">
                Məlumatlar uğurla göndərildi. Təşəkkür edirik!
              </p>
            )}

            <p className="text-lg text-red-600">
              <span className="font-semibold">Qeyd:</span> Xahiş olunur formanı
              göndərməzdən əvvəl əlavə etdiyiniz məlumatları bir daha
              yoxlayasınız, "Göndər" seçildikdən sonra formadakı məlumatlarda dəyişiklik etmək mümkün deyil. 
              <br /> <br />
             <span className="text-xl">  Əgər cavablarınızdan əminsinizsə  "Göndər" düyməsinə basın</span>
            </p>
          </div>
        )}

        {/* Navigasiya + Yadda saxla */}
        <div className="flex justify-between items-center pt-4 border-t mt-4 gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
          >
            Geri
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={savingDraft}
              className="px-4 py-2 text-sm rounded-md border border-blue-600 text-blue-700 disabled:opacity-60"
            >
              {savingDraft ? "Yadda saxlanır..." : "Yadda saxla"}
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white"
              >
                Növbəti
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || alreadySubmitted}
                className="px-4 py-2 text-sm rounded-md bg-green-600 text-white disabled:opacity-60"
              >
                {isSubmitting ? "Göndərilir..." : "Göndər"}
              </button>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}