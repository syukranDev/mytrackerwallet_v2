export const addThousandSeparator = (value) => {
   if (value == null || isNaN(value)) return ''

   const [integerPart, fractionalPart] = value.toString().split('.')
   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

   return fractionalPart ? `RM ${formattedInteger}.${fractionalPart}` : `RM `+ formattedInteger
}