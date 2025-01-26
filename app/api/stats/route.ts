
export async function GET(req: Request) {
    const response = new Response(JSON.stringify({ message: "Hello, world!" }), {
        status: 200,
    });
    return response;
}
