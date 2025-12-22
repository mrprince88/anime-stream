import { NextRequest, NextResponse } from 'next/server';

const OPENSUBTITLES_API_KEY = 'kwWnnrGqBnQeDsjG0rTm7UNYNX0onQX6';
const OPENSUBTITLES_API_URL = 'https://api.opensubtitles.com/api/v1';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query'); // e.g., "Naruto Episode 1"

    if (!query) {
        return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    try {
        // Search for subtitles using OpenSubtitles API
        const searchUrl = `${OPENSUBTITLES_API_URL}/subtitles?query=${encodeURIComponent(query)}&languages=en`;

        const response = await fetch(searchUrl, {
            headers: {
                'Api-Key': OPENSUBTITLES_API_KEY,
                'Content-Type': 'application/json',
                'User-Agent': 'AnimeStream v1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`OpenSubtitles API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform the response to our format
        const subtitles = data.data?.slice(0, 10).map((item: any) => ({
            id: item.attributes.files[0]?.file_id || item.id,
            language: item.attributes.language || 'English',
            fileName: item.attributes.release || item.attributes.feature_details?.movie_name || 'Unknown',
            downloadUrl: item.attributes.files[0]?.file_id ?
                `${OPENSUBTITLES_API_URL}/download` : null,
            fileId: item.attributes.files[0]?.file_id,
            rating: item.attributes.ratings || 0,
            downloads: item.attributes.download_count || 0,
            format: item.attributes.files[0]?.file_name?.split('.').pop() || 'srt'
        })) || [];

        return NextResponse.json({
            query,
            subtitles,
            total: data.total_count || 0
        });

    } catch (error) {
        console.error('Error fetching subtitles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subtitles', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Download endpoint
export async function POST(request: NextRequest) {
    try {
        const { fileId } = await request.json();

        if (!fileId) {
            return NextResponse.json({ error: 'File ID required' }, { status: 400 });
        }

        const downloadResponse = await fetch(`${OPENSUBTITLES_API_URL}/download`, {
            method: 'POST',
            headers: {
                'Api-Key': OPENSUBTITLES_API_KEY,
                'Content-Type': 'application/json',
                'User-Agent': 'AnimeStream v1.0'
            },
            body: JSON.stringify({ file_id: fileId })
        });

        if (!downloadResponse.ok) {
            throw new Error(`Download failed: ${downloadResponse.status}`);
        }

        const downloadData = await downloadResponse.json();

        return NextResponse.json({
            downloadUrl: downloadData.link,
            fileName: downloadData.file_name
        });

    } catch (error) {
        console.error('Error downloading subtitle:', error);
        return NextResponse.json(
            { error: 'Failed to download subtitle' },
            { status: 500 }
        );
    }
}
