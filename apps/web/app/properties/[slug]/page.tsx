import { PropertyDetail } from "@/components/properties/property-detail"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <PropertyDetail slug={slug} />
}
