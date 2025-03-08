export const formatPrice = (price:number)=>{
    return new Intl.NumberFormat("en-US",{
        style:"currency",
        currency:"USD",
        }).format(price);

}


export const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };