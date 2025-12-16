export const ROUTES = {
    // Public routes.
    WELCOME: '/',
    LOGIN: '/login',
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
    VERIFY_EMAIL: '/verify-email',
    VERIFY_EMAIL_FORGOT: '/verify-email/forgot',
    VERIFY_EMAIL_PROFILE: '/verify-email/profile',
    TEST: '/test',

    // Private route.
    HOME: '/',
    DASHBOARD: '/dashboard',
    LEARNING_PATH: '/learning-path',
    LEARNING_PATH_DETAILS: (pathId: string) => `/learning-path/${pathId}`,
    LEARNING_FEED: '/learning-feed',
    LEARNING_PROGRESS: '/learning-progress',
    NOTIFATION: '/notifications',
    SETTING: '/settings',
    PROFILE: '/profile',

    // Admin route
    USER_MANAGEMENT: '/user-management',
    POST_MANAGEMENT: '/post-management'
}