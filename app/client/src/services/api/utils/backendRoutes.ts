const baseUrl = import.meta.env.VITE_BACKEND_URL as string
const demo_path = import.meta.env.VITE_DEMO_ROUTE as string
const fill_survey = import.meta.env.VITE_FILL_SURVEY_ROUTE as string
export const BackendRoutes = {
    DEMO: baseUrl + demo_path,
    FILL_SURVEY: baseUrl + fill_survey,
};