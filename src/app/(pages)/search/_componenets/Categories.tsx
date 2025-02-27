"use client"
import { Category } from '@prisma/client';

import {
    FcMusic,
    FcFilmReel,
    FcMultipleDevices,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc";


import { SlChemistry } from "react-icons/sl";
import { FaChartArea } from "react-icons/fa";
import { MdAccountBalance } from "react-icons/md";
import {IconType} from "react-icons"
import CategoryItem from './CategoryItem';



interface CategoriesProps {
    items:Category[]
}


const iconMap:Record<Category["name"],IconType>={
      "Music":FcMusic,
      "Photography":FcOldTimeCamera,
      "Computer Science":FcMultipleDevices,
      "Filming":FcFilmReel,
      "Accounting":FcSalesPerformance,
      "Art":FaChartArea,
      "Chemistry":SlChemistry,
      "Economics":MdAccountBalance,
      "Fitness":FcSportsMode,
}


function Categories({items}:CategoriesProps) {
  return (
    <div className='flex items-center gap-x-5 overflow-x-auto pb-2 mt-4 px-3'>
       {
        items.map((item) => (
           <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item.id}
            />
        ))
       }
    </div>
  )
}

export default Categories
