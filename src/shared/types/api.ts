/* Base class response bisa ditambahakan */
export type ApiResponse<T> = {
    message: string;
    status: number;
    data: T;
}