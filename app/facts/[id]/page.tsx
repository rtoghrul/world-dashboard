import FactsCategoryClientV2 from '@/components/FactsCategoryClientV2'
import FactsTranslationFixer from '@/components/FactsTranslationFixer'
import { factCategories, getFactCategory } from '@/lib/facts'

export function generateStaticParams() {
  return factCategories.map(category => ({ id: category.id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const category = getFactCategory(params.id)
  return {
    title: `${category.title} Facts — Mind-Blowing Facts`,
    description: category.description,
  }
}

export default function DirectFactsCategoryPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { page?: string }
}) {
  return (
    <>
      <FactsCategoryClientV2 id={params.id} page={searchParams?.page} />
      <FactsTranslationFixer />
    </>
  )
}
