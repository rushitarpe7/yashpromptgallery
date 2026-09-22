import { Navbar } from "@/components/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Made by Ruhikesh Tarpe ❤️
          </h2>
          <div className="flex flex-col items-center justify-center gap-2 text-lg text-slate-400">
            <p>
              My Contact Details: <strong className="text-slate-200">7498996055</strong> for contact to make the Sites
            </p>
            <p>
              Email: <strong className="text-slate-200">rushitarpe44@gmail.com</strong>
            </p>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row border-t border-slate-800 pt-8">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Yash's PromptGallery. Browse & copy AI prompts.
            </p>
            <p className="text-xs text-slate-600">
              Built with Next.js + shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
