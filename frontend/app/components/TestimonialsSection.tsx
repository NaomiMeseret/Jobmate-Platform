"use client";

import { motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/providers/language-provider";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
  flag: string;
  rating: number;
};

const storageKey = "jobmate-testimonials";

const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "JobMate helped me turn my CV into something recruiters actually understood. Two weeks later, I got interviews with two Addis tech companies.",
    name: "Mekdes T.",
    role: "Junior Software Developer",
    location: "Ethiopia",
    flag: "🇪🇹",
    rating: 5,
  },
  {
    quote:
      "The interview coach helped me practice answers in a calm way. I walked into my banking interview with much more confidence.",
    name: "Nahom G.",
    role: "Finance Graduate",
    location: "Ethiopia",
    flag: "🇪🇹",
    rating: 5,
  },
  {
    quote:
      "The roadmap showed me which data skills to focus on first. It made the job search feel organized instead of overwhelming.",
    name: "Saron A.",
    role: "Data Analyst",
    location: "Ethiopia",
    flag: "🇪🇹",
    rating: 5,
  },
];

const amTestimonials: Testimonial[] = [
  {
    quote:
      "JobMate CVዬን ቀጣሪዎች በቀላሉ የሚረዱት እንዲሆን ረዳኝ። ከሁለት ሳምንት በኋላ በአዲስ አበባ ሁለት የቴክ ኩባንያዎች ቃለመጠይቅ ጠሩኝ።",
    name: "መቅደስ T.",
    role: "Junior Software Developer",
    location: "ኢትዮጵያ",
    flag: "🇪🇹",
    rating: 5,
  },
  {
    quote:
      "የቃለመጠይቅ አሰልጣኙ መልሶቼን በተረጋጋ መንገድ እንድለማመድ ረዳኝ። ወደ ባንክ ቃለመጠይቄ በተሻለ መተማመን ገባሁ።",
    name: "ናሆም G.",
    role: "Finance Graduate",
    location: "ኢትዮጵያ",
    flag: "🇪🇹",
    rating: 5,
  },
  {
    quote:
      "የሙያ መንገዱ መጀመሪያ ላይ የትኞቹን የዳታ ክህሎቶች ልተኩር እንደሚገባ አሳየኝ። የስራ ፍለጋው የተደራጀ እንዲመስል አደረገው።",
    name: "ሳሮን A.",
    role: "Data Analyst",
    location: "ኢትዮጵያ",
    flag: "🇪🇹",
    rating: 5,
  },
];

const copy = {
  en: {
    eyebrow: "Social proof",
    titleA: "Ethiopian Talent,",
    titleB: "Global Careers",
    desc:
      "Real momentum from Ethiopian job seekers using JobMate to sharpen applications, find better matches, and prepare for bigger opportunities.",
    share: "Share your story",
    addTitle: "Add your own testimonial",
    addDesc:
      "Tell future JobMate users how the platform helped your CV, interview preparation, job search, or career direction.",
    thanks: "Thanks. Your testimonial is shown on this page in your browser.",
    name: "Name",
    role: "Role",
    country: "Country",
    rating: "Rating",
    story: "Your story",
    submit: "Add testimonial",
    placeholders: ["Your name", "Student, developer, analyst...", "Ethiopia", "How did JobMate help you?"],
  },
  am: {
    eyebrow: "ምስክርነቶች",
    titleA: "የኢትዮጵያ ተሰጥኦ፣",
    titleB: "ዓለም አቀፍ ሙያዎች",
    desc: "JobMateን በመጠቀም መተግበሪያዎቻቸውን የሚያሻሽሉ፣ የተሻሉ ስራዎችን የሚያገኙ እና ለትልቅ እድሎች የሚዘጋጁ የኢትዮጵያ ስራ ፈላጊዎች።",
    share: "ታሪክዎን ያጋሩ",
    addTitle: "የራስዎን ምስክርነት ያክሉ",
    addDesc: "JobMate በCV፣ በቃለመጠይቅ ዝግጅት፣ በስራ ፍለጋ ወይም በሙያ አቅጣጫ እንዴት እንደረዳዎ ይንገሩ።",
    thanks: "እናመሰግናለን። ምስክርነትዎ በዚህ ብራውዘር ላይ በገጹ ይታያል።",
    name: "ስም",
    role: "ሚና",
    country: "አገር",
    rating: "ደረጃ",
    story: "ታሪክዎ",
    submit: "ምስክርነት አክል",
    placeholders: ["ስምዎ", "ተማሪ፣ ዴቨሎፐር፣ ተንታኝ...", "ኢትዮጵያ", "JobMate እንዴት ረዳዎ?"],
  },
};

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function RatingStars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M10 1.8L12.5 7L18.2 7.8L14.1 11.8L15.1 17.4L10 14.8L4.9 17.4L5.9 11.8L1.8 7.8L7.5 7L10 1.8Z"
            fill={index < rating ? "var(--accent-gold)" : "var(--border)"}
          />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const c = copy[language];
  const [submittedTestimonials, setSubmittedTestimonials] = useState<
    Testimonial[]
  >([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    location: language === "am" ? "ኢትዮጵያ" : "Ethiopia",
    quote: "",
    rating: "5",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Testimonial[];
      if (Array.isArray(parsed)) {
        setSubmittedTestimonials(parsed);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const testimonials = useMemo(
    () => [
      ...submittedTestimonials,
      ...(language === "am" ? amTestimonials : defaultTestimonials),
    ],
    [language, submittedTestimonials]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTestimonial: Testimonial = {
      name: form.name.trim(),
      role: form.role.trim(),
      location: form.location.trim() || (language === "am" ? "ኢትዮጵያ" : "Ethiopia"),
      quote: form.quote.trim(),
      rating: Number(form.rating),
      flag: "🇪🇹",
    };

    if (
      !nextTestimonial.name ||
      !nextTestimonial.role ||
      !nextTestimonial.location ||
      !nextTestimonial.quote
    ) {
      return;
    }

    const nextTestimonials = [nextTestimonial, ...submittedTestimonials].slice(
      0,
      6
    );
    setSubmittedTestimonials(nextTestimonials);
    window.localStorage.setItem(storageKey, JSON.stringify(nextTestimonials));
    setForm({
      name: "",
      role: "",
      location: language === "am" ? "ኢትዮጵያ" : "Ethiopia",
      quote: "",
      rating: "5",
    });
    setSubmitted(true);
  }

  return (
    <section id="testimonials" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
              {c.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-tight tracking-normal text-[var(--text-primary)]">
              {c.titleA} <span className="gradient-text">{c.titleB}</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
            {c.desc}
          </p>
        </div>

        <motion.div
          className="mt-12 flex snap-x gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              className="glass-card min-h-[360px] min-w-[86%] snap-start p-6 md:min-w-0 md:p-7"
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="glass-reflection"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-5">
                  <span
                    className="font-display text-7xl font-semibold leading-none opacity-30"
                    aria-hidden="true"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    “
                  </span>
                  <RatingStars rating={testimonial.rating} />
                </div>

                <p className="mt-4 text-base leading-8 text-[var(--text-primary)] md:text-lg">
                  {testimonial.quote}
                </p>

                <div className="mt-auto pt-8">
                  <div className="h-px w-full bg-[var(--border)]" />
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-medium text-[var(--text-primary)]">
                        {testimonial.name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-muted)] md:text-base">
                        {testimonial.role}, {testimonial.location}
                      </p>
                    </div>
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface-hover)] text-xl"
                      aria-hidden="true"
                    >
                      {testimonial.flag}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="glass-card mt-8 grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-gold)]">
              {c.share}
            </p>
            <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-[var(--text-primary)] md:text-4xl">
              {c.addTitle}
            </h3>
            <p className="mt-4 text-base leading-8 text-[var(--text-muted)] md:text-lg">
              {c.addDesc}
            </p>
            {submitted && (
              <p className="mt-4 rounded-lg border border-[var(--border-accent)] bg-[var(--bg-surface-hover)] px-4 py-3 text-base text-[var(--accent-green)]">
                {c.thanks}
              </p>
            )}
          </div>

          <form className="relative z-10 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-[var(--text-primary)]">
                {c.name}
                <input
                  className="modern-input"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder={c.placeholders[0]}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[var(--text-primary)]">
                {c.role}
                <input
                  className="modern-input"
                  value={form.role}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }
                  placeholder={c.placeholders[1]}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <label className="grid gap-2 text-sm font-medium text-[var(--text-primary)]">
                {c.country}
                <input
                  className="modern-input"
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  placeholder={c.placeholders[2]}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[var(--text-primary)]">
                {c.rating}
                <select
                  className="modern-input"
                  value={form.rating}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      rating: event.target.value,
                    }))
                  }
                >
                  <option value="5">{language === "am" ? "5 ኮከቦች" : "5 stars"}</option>
                  <option value="4">{language === "am" ? "4 ኮከቦች" : "4 stars"}</option>
                  <option value="3">{language === "am" ? "3 ኮከቦች" : "3 stars"}</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-[var(--text-primary)]">
              {c.story}
              <textarea
                className="modern-input min-h-32 resize-y"
                value={form.quote}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quote: event.target.value,
                  }))
                }
                placeholder={c.placeholders[3]}
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--accent-gold)] px-5 text-base font-medium text-[#080C18] transition hover:brightness-105"
            >
              {c.submit}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
