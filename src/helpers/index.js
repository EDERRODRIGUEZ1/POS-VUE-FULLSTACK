export const formatCurrency = amount => Number(amount).toLocaleString('en-GT', {
    style: 'currency',
    currency: 'GTQ'
})