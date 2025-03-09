"use client";

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function DeleteButton({courseId}:{courseId:string}) {
    const [isLoading, setIsLoading] = useState(false);
     const router= useRouter();
    const deleteMaterials = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/generate/material/${courseId}`);
            toast.success("The material has been deleted successfully");
            router.push('/generate')
            router.refresh()

        } 
        catch (error) {
            console.log("the error during deleting the studymaterial",error);
            toast.error("Failed to delete the material");
        } 
        finally {
            setIsLoading(false);
        }
    }
     
    return (
        <Button 
            onClick={deleteMaterials} 
            disabled={isLoading} 
            variant="destructive" 
            className="flex items-center gap-2"
        >
            <TrashIcon size={16} />
            {isLoading ? "Deleting..." : "Delete"}
        </Button>
    )
}

export default DeleteButton;