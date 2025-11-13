export const BASE_URL = 'http://localhost:5000'

export const API_PATH = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        GET_USER_INFO: '/api/v1/auth/getUser',
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: '/api/v1/dashboard',
    },
    INCOME: {
        ADD_INCOME: '/api/v1/income/addIncome',
        GET_INCOME_DATA: '/api/v1/income/getAllIncome',
        DELETE_INCOME: (id) => `/api/v1/income/deleteIncome/${id}`,
        DOWNLOAD_INCOME_EXCEL: '/api/v1/income/downloadIncomeExcel',
        DESTINATIONS: {
            GET_ALL: '/api/v1/income/destinations/getAllDestinations',
            ADD: '/api/v1/income/destinations/addDestination',
            UPDATE: (id) => `/api/v1/income/destinations/updateDestination/${id}`,
            DELETE: (id) => `/api/v1/income/destinations/deleteDestination/${id}`,
        },
    },
    EXPENSE: {
        ADD_EXPENSE: '/api/v1/expense/addExpense',
        GET_EXPENSE_DATA: '/api/v1/expense/getAllExpense',
        DELETE_EXPENSE: (id) => `/api/v1/expense/deleteExpense/${id}`,
        DOWNLOAD_EXPENSE_EXCEL: '/api/v1/expense/downloadExpenseExcel',
    },
    IMAGE: {
        UPLOAD_IMAGE: '/api/v1/auth/uploadProfileImage',
    },
}