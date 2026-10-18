import { pageMetadata } from '@/lib/seo'
import FactsCategoryTranslated from '@/components/FactsCategoryTranslated'
import { factCategories, getFactCategory } from '@/lib/facts'

export function generateStaticParams() {
  return factCategories.map(category => ({ id: category.id }))
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const category = getFactCategory(params.id)
  return pageMetadata(`/facts/${category.id}`, `${category.title} Facts — Mind-Blowing Facts`, category.description)
}

export default async function DirectFactsCategoryPage(
  props: {
    params: Promise<{ id: string }>
    searchParams?: Promise<{ page?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return <FactsCategoryTranslated id={params.id} page={searchParams?.page} />
}
