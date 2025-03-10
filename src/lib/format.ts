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


  export function formatTime(seconds: number): string {
    if (seconds === null || seconds === undefined) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }