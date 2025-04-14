import { FormResponse } from '../model/response';

async function submitSurvey(url: string): Promise<FormResponse> {
    try {
        // const response = await axios.get(url);
        // return {
        //     data: response.data,
        //     status: response.status,
        //     statusText: response.statusText,
        //     headers: response.headers,
        // };
        return {
            tokensUsed: 100,
            responseUrl: url,
        }
    } catch (error: any) {
        throw new Error(error.response ? error.response.data : error.message);
    }
}

export default submitSurvey;