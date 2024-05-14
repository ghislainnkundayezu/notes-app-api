
export interface CustomError extends Error {
    statusCode: number,
    name: string,
}
