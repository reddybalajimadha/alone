"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SavedReport {
  id: string;
  slug: string;
  objectName: string;
  summaryText: string;
  imageB64: string;
  createdAt: string;
}

const LOADING_CAPTIONS = [
  "Finding a forest...",
  "Searching for graphite seams...",
  "Building a kiln hot enough...",
  "Tapping the equatorial latex...",
  "Smelting the copper and zinc...",
  "Alloying the brass...",
  "Mixing the pigments...",
  "Sieving the clay...",
  "Reconstructing the connections..."
];

export default function Landing() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Submission/Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCaptionIdx, setLoadingCaptionIdx] = useState(0);

  // Archive Feed States
  const [archive, setArchive] = useState<SavedReport[]>([]);
  const [isLoadingArchive, setIsLoadingArchive] = useState(true);

  // Load persistent configurations and archive feed on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("alone_gemini_api_key");
    if (savedKey) setApiKey(savedKey);

    const savedAdminPass = localStorage.getItem("alone_admin_password");
    if (savedAdminPass) setAdminPassword(savedAdminPass);

    async function fetchArchive() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setArchive(data);
        }
      } catch (err) {
        console.error("Failed to load archive feed:", err);
      } finally {
        setIsLoadingArchive(false);
      }
    }

    fetchArchive();
  }, []);

  // Rotate loading captions during submission
  useEffect(() => {
    if (!isSubmitting) return;
    const interval = setInterval(() => {
      setLoadingCaptionIdx((prev) => (prev + 1) % LOADING_CAPTIONS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  function acceptFile(f: File | null | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleBegin() {
    if (apiKey) {
      localStorage.setItem("alone_gemini_api_key", apiKey);
    } else {
      localStorage.removeItem("alone_gemini_api_key");
    }
    if (adminPassword) {
      localStorage.setItem("alone_admin_password", adminPassword);
    } else {
      localStorage.removeItem("alone_admin_password");
    }

    setIsSubmitting(true);

    try {
      let imageBase64 = "";
      if (file) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      }

      // If apiKey is provided, use "cloud". Otherwise, route lets server decide (env key or mock)
      const brain = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "cloud" : "local";

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          brain,
          apiKey: apiKey,
          filename: file ? file.name : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const data = await response.json();
      router.push(`/report/${data.slug}`);
    } catch (error) {
      console.error("Generation failed:", error);
      alert(error instanceof Error ? error.message : "Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[68ch] flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-ink-faint animate-pulse">
          Alone
        </p>
        
        {/* Artsy concentric tree rings & timeline connection animation */}
        <div className="relative mb-12 h-28 w-28 flex items-center justify-center select-none">
          <svg 
            className="absolute w-full h-full stroke-ink fill-none stroke-[0.8] opacity-60 animate-[spin_45s_linear_infinite] overflow-visible" 
            viewBox="0 0 100 100"
          >
            {/* Concentric ripples with staggered pulsing animations */}
            <circle cx="50" cy="50" r="10" className="animate-[pulse_1.8s_infinite_ease-in-out_0.2s]" />
            <circle cx="50" cy="50" r="22" className="animate-[pulse_1.8s_infinite_ease-in-out_0.5s]" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="34" className="animate-[pulse_1.8s_infinite_ease-in-out_0.8s]" />
            <circle cx="50" cy="50" r="46" className="animate-[pulse_1.8s_infinite_ease-in-out_1.1s]" strokeDasharray="6 3" />
            {/* Fine crosshairs representing alignment */}
            <line x1="50" y1="-5" x2="50" y2="105" className="opacity-25" strokeWidth={0.5} />
            <line x1="-5" y1="50" x2="105" y2="50" className="opacity-25" strokeWidth={0.5} />
          </svg>
          {/* Central spinning axis core */}
          <div className="h-5 w-5 rounded-full border border-ink border-t-transparent animate-[spin_1.5s_linear_infinite]" />
        </div>

        <p className="font-serif text-xl italic text-ink-soft min-h-[2rem] transition-all duration-300">
          {LOADING_CAPTIONS[loadingCaptionIdx]}
        </p>
        <p className="mt-8 text-xs italic text-ink-faint">
          Sourcing materials from scratch takes years. The report takes seconds.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[68ch] flex-col px-6 py-12 sm:py-24">
      {/* Top Configuration Trigger Bar */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="rounded-sm border border-rule bg-paper/50 px-3 py-1.5 font-serif text-xs italic text-ink-soft hover:border-ink hover:text-ink transition-all focus:outline-none cursor-pointer"
        >
          {showSettings ? "Close Configuration" : "Configure API & Admin"}
        </button>
      </div>

      <header className="text-center">
        <p className="mb-10 text-sm uppercase tracking-[0.3em] text-ink-faint">
          Alone
        </p>
        <p className="text-balance text-2xl italic leading-snug text-ink-soft sm:text-3xl">
          What would it take to make this &mdash; alone, with nothing, in your
          lifetime?
        </p>
      </header>

      {/* Collapsed API Key & Admin Settings */}
      {showSettings && (
        <section className="mt-8 p-6 rounded-sm border border-rule bg-paper/40 transition-all duration-300 space-y-6">
          <div>
            <h4 className="text-center text-xs uppercase tracking-[0.2em] text-ink-soft mb-2 font-semibold">
              Gemini API Configuration
            </h4>
            <p className="text-xs text-ink-faint text-center mb-3 leading-relaxed max-w-md mx-auto">
              To analyze custom uploads, paste your own Gemini API key. If left blank, the app will run in offline mode using pre-authored mock reports.
            </p>
            
            {/* Step-by-step instructions on getting a key */}
            <div className="max-w-md mx-auto mb-4 bg-ink/[0.01] border border-rule/50 p-4 rounded-sm text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">How to get a free API Key:</p>
              <ol className="list-decimal pl-4 text-xs text-ink-faint space-y-1.5 leading-relaxed">
                <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-ink-soft underline hover:text-ink">Google AI Studio</a>.</li>
                <li>Sign in with your Google account.</li>
                <li>Click <strong className="font-semibold">Get API Key</strong> and create a new key.</li>
                <li>Copy the generated key and paste it below. It stays in your own browser's storage.</li>
              </ol>
            </div>

            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                const val = e.target.value;
                setApiKey(val);
                localStorage.setItem("alone_gemini_api_key", val);
              }}
              placeholder="Paste your Gemini API key (AIzaSy...) here"
              className="w-full max-w-sm mx-auto block rounded-sm border border-rule bg-transparent px-4 py-2 font-mono text-sm text-ink placeholder:text-ink-faint/55 outline-none focus:border-ink-soft text-center"
            />
          </div>

          <div className="border-t border-rule/50 pt-6">
            <h4 className="text-center text-xs uppercase tracking-[0.2em] text-ink-soft mb-2 font-semibold">
              Admin Configuration
            </h4>
            <p className="text-xs text-ink-faint text-center mb-3 leading-relaxed max-w-md mx-auto">
              Enter the admin password to enable administrative controls (deleting library archives).
            </p>
            <input
              id="adminPassword"
              type="password"
              value={adminPassword}
              onChange={(e) => {
                const val = e.target.value;
                setAdminPassword(val);
                localStorage.setItem("alone_admin_password", val);
              }}
              placeholder="Enter Admin Password"
              className="w-full max-w-sm mx-auto block rounded-sm border border-rule bg-transparent px-4 py-2 font-mono text-sm text-ink placeholder:text-ink-faint/55 outline-none focus:border-ink-soft text-center"
            />
          </div>
        </section>
      )}

      {/* Upload Drag-and-Drop Card */}
      <section className="mt-16">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            acceptFile(e.dataTransfer.files?.[0]);
          }}
          className={[
            "block w-full cursor-pointer rounded-sm border border-dashed px-10 py-20 text-center transition-colors",
            isDragging
              ? "border-ink bg-ink/5"
              : "border-rule hover:border-ink-soft hover:bg-ink/[0.02]",
          ].join(" ")}
        >
          {previewUrl ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={previewUrl}
                alt=""
                className="max-h-48 max-w-full object-contain grayscale opacity-80"
              />
              <p className="text-sm text-ink-soft">
                {file?.name}
                <span className="ml-3 text-ink-faint italic">
                  click to replace
                </span>
              </p>
            </div>
          ) : (
            <>
              <p className="text-xl text-ink-soft font-serif italic">
                Drop a photo of an object here.
              </p>
              <p className="mt-3 text-sm italic text-ink-faint">
                Or click to choose one.
              </p>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
      </section>

      {/* Submit trigger button */}
      <section className="mt-12 text-center">
        <button
          type="button"
          onClick={handleBegin}
          className="border-b border-ink pb-1 text-xl tracking-wide text-ink transition-opacity hover:opacity-70 font-serif italic"
        >
          Begin Analysis
        </button>
        <p className="mt-4 text-xs italic text-ink-faint">
          The first answer takes a while. So does the second one.
        </p>
      </section>

      {/* Running locally documentation card */}
      <section className="mt-24 p-6 rounded-md border border-rule bg-paper/40 flex flex-col gap-4">
        <h3 className="font-serif text-lg font-semibold text-ink">
          Running Locally Offline
        </h3>
        <p className="font-serif text-sm text-ink-soft leading-relaxed">
          To execute this application completely offline and isolated &mdash; adhering to the same conditions as the question itself &mdash; you can host it locally using open-source models:
        </p>
        <ol className="list-decimal pl-5 font-serif text-sm text-ink-soft space-y-2">
          <li>Ensure you have a machine with a WebGPU-enabled graphics processor.</li>
          <li>Install <strong className="font-semibold">Ollama</strong> and pull the Gemma model: <code className="bg-ink/[0.04] px-1 py-0.5 rounded font-mono text-xs">ollama run gemma2:2b</code></li>
          <li>Clone this repository, configure your database, and run locally in offline mode:
            <code className="block bg-ink/[0.04] p-2 rounded font-mono text-xs mt-1.5 overflow-x-auto whitespace-pre">
              DATABASE_URL="file:./dev.db" npm run dev
            </code>
          </li>
        </ol>
      </section>

      {/* Blog/Archive Feed */}
      <section className="mt-28 border-t border-rule pt-16">
        <h2 className="text-center text-sm uppercase tracking-[0.25em] text-ink-faint mb-12">
          &sect; The Library of Uncovered Objects
        </h2>

        {isLoadingArchive ? (
          <div className="text-center font-serif text-sm italic text-ink-faint">
            Loading monograph archives...
          </div>
        ) : archive.length === 0 ? (
          <div className="text-center font-serif text-sm italic text-ink-faint">
            The archives are empty. Upload the first object to begin the log.
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2">
            {archive.map((post) => (
              <article
                key={post.id}
                onClick={() => router.push(`/report/${post.slug}`)}
                className="group relative cursor-pointer flex flex-col gap-4 rounded-sm border border-transparent p-2 hover:border-rule bg-paper/20 hover:bg-paper/50 transition-all duration-300"
              >
                {adminPassword && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete the monograph for "${post.objectName}"?`)) {
                        try {
                          const res = await fetch(`/api/reports?id=${post.id}`, {
                            method: "DELETE",
                            headers: {
                              "Authorization": `Bearer ${adminPassword}`,
                            },
                          });
                          if (res.ok) {
                            setArchive((prev) => prev.filter((p) => p.id !== post.id));
                          } else {
                            const err = await res.json();
                            alert(err.error || "Failed to delete monograph");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("An error occurred while deleting the monograph");
                        }
                      }
                    }}
                    className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-rule bg-paper text-xs text-ink-faint hover:border-ink hover:text-ink transition-colors focus:outline-none"
                    title="Delete monograph"
                  >
                    ✕
                  </button>
                )}

                {/* Object Thumbnail */}
                {post.imageB64 ? (
                  <div className="aspect-[4/3] w-full bg-paper rounded-sm border border-rule/50 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={post.imageB64}
                      alt={post.objectName}
                      className="max-h-full max-w-full object-contain grayscale opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-paper rounded-sm border border-rule/50 flex items-center justify-center italic text-xs text-ink-faint select-none">
                    No image recorded
                  </div>
                )}

                {/* Card copy */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-ink-faint uppercase">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-ink group-hover:text-ink-soft transition-colors">
                    {post.objectName}
                  </h3>
                  <p className="font-serif text-sm text-ink-soft italic leading-relaxed line-clamp-3 mt-1.5">
                    {post.summaryText}
                  </p>
                  <span className="text-xs text-ink font-semibold group-hover:underline mt-2 inline-flex items-center gap-1">
                    Read monograph &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer / Terms & Privacy Monograph */}
      <footer className="mt-32 border-t border-rule pt-12 pb-8 text-center text-xs text-ink-faint font-serif leading-relaxed">
        <p className="uppercase tracking-[0.2em] mb-4 text-[10px] font-semibold text-ink-soft">&sect; Monograph Terms & Privacy Policy</p>
        <div className="max-w-md mx-auto space-y-3 italic">
          <p>
            By using this tool, you acknowledge that all uploaded images and custom-generated monographs are saved to a public database. Do not upload private, personal, or sensitive images.
          </p>
          <p>
            Gemini API keys and admin passwords provided in the configuration panel are stored entirely in your local browser storage (<code className="bg-ink/[0.04] px-1 py-0.5 rounded font-mono text-[10px] not-italic">localStorage</code>). They are never saved to our database, never stored on our server, and never shared with other users.
          </p>
          <p>
            API requests are processed securely in-memory. If no API key is provided, the application runs entirely offline using pre-authored mock monographs.
          </p>
        </div>
      </footer>
    </main>
  );
}
