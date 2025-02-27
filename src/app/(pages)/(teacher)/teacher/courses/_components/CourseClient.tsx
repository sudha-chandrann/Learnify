"use client";


import { DataTable } from './DataTable';
import { columns } from './Columns';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CoursesClient({ data}:any) {
  return (
    <div className='p-4'>
      <div className='mt-5'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
