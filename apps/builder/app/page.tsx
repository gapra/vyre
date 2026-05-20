import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
            No-code app builder for SaaS
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Build apps your clients actually need
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Create feature request boards, bug trackers, roadmaps — and custom modules — without writing a line of code.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary text-base px-6 py-3">
            Go to Dashboard
          </Link>
          <Link href="/auth/signin" className="btn-secondary text-base px-6 py-3">
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          {[
            { title: "Custom Modules", desc: "Feature requests, bug tracker, or build your own" },
            { title: "Custom Fields", desc: "Text, select, date, checkboxes — any field type" },
            { title: "Custom Pages", desc: "Compose pages from views, metrics, and rich text" },
          ].map((f) => (
            <div key={f.title} className="card p-4 text-left">
              <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
