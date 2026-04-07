import { EmptyState } from "@/components/states/empty-state";
import { SearchResultsClient } from "@/components/search/search-results-client";

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() ?? "";

  if (!query) {
    return (
      <main className="page-shell py-10">
        <EmptyState
          title="Start with a search"
          description="Enter a product name or natural language shopping request to see ranked deals."
        />
      </main>
    );
  }

  return <SearchResultsClient initialQuery={query} />;
}
