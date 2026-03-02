// utils/response.ts
export function jsonResponse(data: any, message: string = 'success', status = 200) {
    return new Response(JSON.stringify({
        status,
        message,
        data,
    }), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export function errorResponse(message: string, status = 400) {
    return jsonResponse({}, 'Action failed !',status);
}