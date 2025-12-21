import { NextRequest, NextResponse } from 'next/server';
import { getEpisodeSources } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const dub = searchParams.get('dub') === 'true' || searchParams.get('dub') === '1';

  if (!id) {
    return NextResponse.json({ error: 'Episode ID is required' }, { status: 400 });
  }

  try {
    const sources = await getEpisodeSources(id, dub);

    console.log("sources",sources);
    
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    return NextResponse.json({ error: 'Failed to fetch episode sources' }, { status: 500 });
  }
}
