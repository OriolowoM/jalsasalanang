import { redirect } from 'next/navigation';

export default async function ArticlesRedirectPage(props: { searchParams: Promise<Record<string, string>> }) {
  const params = await props.searchParams;
  const qs = new URLSearchParams(params).toString();
  redirect(qs ? `/blog?${qs}` : '/blog');
}
