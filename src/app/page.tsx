import { DomainForm } from "@/components/domain-form";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold">Find your ideal domain</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Describe the domain you are looking for and we will find the best
          options for you.
        </p>
        <DomainForm />
      </main>
    </div>
  );
}
