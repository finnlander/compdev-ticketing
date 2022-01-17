/**
 * Session data (used with cookie--session library)
 */
export interface Session {
    /**
     * JSON web token that is used for authenticating the current user.
     */
    jwt: string | null;
}
