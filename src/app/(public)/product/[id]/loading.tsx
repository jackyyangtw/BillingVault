import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProductLoading() {
  return (
    <main className="pt-24">
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="flex flex-col gap-5">
            <div className="bg-muted size-14 rounded-2xl" />
            <div className="bg-muted h-10 max-w-xl rounded-lg" />
            <div className="bg-muted h-24 max-w-3xl rounded-lg" />
            <div className="flex gap-3">
              <div className="bg-muted h-10 w-28 rounded-4xl" />
              <div className="bg-muted h-10 w-28 rounded-4xl" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <div className="bg-muted h-6 w-32 rounded-md" />
              <div className="bg-muted h-4 w-full rounded-md" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="bg-muted h-10 w-24 rounded-md" />
              <div className="bg-muted h-4 w-full rounded-md" />
              <div className="bg-muted h-4 w-3/4 rounded-md" />
              <div className="bg-muted h-4 w-2/3 rounded-md" />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
