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
    const body = await request.json();
    console.log('[v0] Received body:', JSON.stringify(body));
    
    const { fullName, dimensionVector } = body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      console.log('[v0] Invalid fullName:', fullName);
      return new Response(JSON.stringify({ error: 'Full name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(dimensionVector) || dimensionVector.length !== 7) {
      console.log('[v0] Invalid dimensionVector:', dimensionVector, 'length:', dimensionVector?.length);
      return new Response(JSON.stringify({ error: 'Invalid dimension vector', received: dimensionVector }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.DATABASE_URL) {
      console.log('[v0] DATABASE_URL not set');
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[v0] Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);
    const normalizedName = fullName.trim().toLowerCase();

    // Upsert: insert or update if exists (no timestamps)
    // Format array as PostgreSQL array literal
    const vectorArray = `{${dimensionVector.join(',')}}`;
    console.log('[v0] Executing SQL with name:', normalizedName, 'vector:', vectorArray);
    await sql`
      INSERT INTO room_results (full_name, dimension_vector)
      VALUES (${normalizedName}, ${vectorArray}::real[])
      ON CONFLICT (full_name) 
      DO UPDATE SET dimension_vector = EXCLUDED.dimension_vector
    `;
    console.log('[v0] SQL executed successfully');

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
