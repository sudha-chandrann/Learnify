import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request): Promise<Response> {
    try {
        // Parse the JSON body
        const body = (await request.json()) as { paramsToSign: Record<string, string> };
        const { paramsToSign } = body;

        // Validate environment variable
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
            return new Response(
                JSON.stringify({ error: "CLOUDINARY_API_SECRET is not defined" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Generate the signature
        const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

        // Return the signature as JSON
        return new Response(
            JSON.stringify({ signature }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: unknown) {
        // Handle any errors gracefully
        console.error("Error generating Cloudinary signature:", err);

        // Safely handle error types
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";

        return new Response(
            JSON.stringify({ error: "Failed to generate signature", details: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
