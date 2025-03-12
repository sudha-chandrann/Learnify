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

// Format date to time format
export function formatTimeFromDate(dateString:Date) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}



  export function formatTime(seconds: number): string {
    if (seconds === null || seconds === undefined) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }


  // Helper function to format time difference
  export default function formatTimeDifference(startDate: string | Date, endDate: string | Date): string {
    const start = new Date(startDate).getTime(); // Convert to timestamp
    const end = new Date(endDate).getTime();     // Convert to timestamp
  
    if (isNaN(start) || isNaN(end)) {
      throw new Error("Invalid date provided");
    }
  
    const diffMs = end - start;
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }
  




