export interface JwtPayload {
    id: number;
    email: string;
    authStrategy: 'local' | 'google';
    token_version: number;
}