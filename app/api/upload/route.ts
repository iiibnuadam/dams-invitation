import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // In a real app, you should check authentication here
        // const session = await auth();
        // if (!session) throw new Error('Unauthorized');

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called when the upload is completed
        console.log('blob uploaded', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
