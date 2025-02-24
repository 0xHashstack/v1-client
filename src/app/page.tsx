import { redirect } from 'next/navigation';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export default function page() {
	redirect('/v1');
}
