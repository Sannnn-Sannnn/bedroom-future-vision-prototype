import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { fullName, dimensionVector } = await request.json();

    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return new Response(JSON.stringify({ error: 'Full name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(dimensionVector) || dimensionVector.length !== 7) {
      return new Response(JSON.stringify({ error: 'Invalid dimension vector' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const normalizedName = fullName.trim().toLowerCase();

    // Upsert: insert or update if exists
    await sql`
      INSERT INTO room_results (full_name, dimension_vector, updated_at)
      VALUES (${normalizedName}, ${dimensionVector}, NOW())
      ON CONFLICT (full_name) 
      DO UPDATE SET 
        dimension_vector = EXCLUDED.dimension_vector,
        updated_at = NOW()
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Result saved successfully',
      name: normalizedName 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving result:', error);
    return new Response(JSON.stringify({ error: 'Failed to save result' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
