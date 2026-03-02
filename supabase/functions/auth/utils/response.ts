// utils/response.ts
export function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export function errorResponse(message: string, status = 400) {
    return jsonResponse({ message }, status);
}