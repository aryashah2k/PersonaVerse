const baseUrl = import.meta.env.VITE_BACKEND_URL as string
const demo_path = import.meta.env.VITE_DEMO_ROUTE as string

export const BackendRoutes = {
    DEMO: baseUrl + demo_path,
};