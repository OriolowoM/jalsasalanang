import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, history, sessionId } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, message: 'A query or question string is required.' },
        { status: 400 }
      );
    }

    // Call Express API backend
    const apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.PORT && !isNaN(Number(process.env.PORT))
        ? `http://127.0.0.1:${process.env.PORT}/api/v1`
        : 'https://jalsasalana.ng/api/v1');
    const response = await fetch(`${apiUrl}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, history, sessionId }),
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error processing concierge chat.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
