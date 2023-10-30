export const formatCurrency = amount => Number(amount).toLocaleString('en-GT', {
    style: 'currency',
    currency: 'GTQ'
})

export const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return  `${day}/${month}/${year}`;
  }  