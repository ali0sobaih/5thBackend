interface GoogleUserPayload extends JwtPayload {
    authStrategy: 'google';
    token_version: number;
}