import { IDayOfMonth, IAttendanceOfMonth, IAttendanceDetail } from '@/app/types';
import React from 'react'

function AttendanceList({filterObj, daysOfMonth, attendancesOfMonth, modal, setAttendanceIncidence, attendanceIncidence}:any) {
    return (
        <>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="">
                        <tr>
                            <th className="px-2 py-2 border border-gray-400 text-center font-bold bg-gray-300">#</th>
                            <th className="px-2 py-2 border border-gray-400 text-center font-bold bg-gray-300">EMPLEADO</th>
                            {daysOfMonth.map((item: IDayOfMonth) => 
                                <th key={item.id}  className="px-2 py-2 border border-gray-400 text-center font-bold bg-gray-300">
                                    {item.name}<br/>{item.id}
                                </th>
                            )}
                            <th className="px-2 py-2 border border-gray-400 text-center font-bold bg-lime-500">DIAS<br/> TRABAJADOS</th>
                            <th className="px-2 py-2 border border-gray-400 text-center font-bold bg-red-500">DIAS NO<br/>TRABAJADOS</th>
                        </tr>
                    </thead>
                    <tbody>

                    {attendancesOfMonth?.map((item: IAttendanceOfMonth) => 
                    <tr key={item.employee?.id} className="bg-white">
                        <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border border-gray-400 dark:text-white">{item.employee?.id}</td>
                        <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border border-gray-400 dark:text-white">{item.employee?.lastName}, {item.employee?.firstName}</td>
                        {item.attendancedetailSet?.map((a: IAttendanceDetail) => 
                            <td key={a.id} className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border border-gray-400 dark:text-white">
                                
                                <button onClick={(e)=>{
                                    modal.show();
                                    setAttendanceIncidence({...attendanceIncidence, 
                                        attendanceDetailId: a.id, 
                                        employeeId: item.employee?.id, 
                                        firstName: item.employee?.firstName, 
                                        lastName: item.employee?.lastName, 
                                        statusChoice: a.status, 
                                        registerDate: a.registerDate, 
                                        observation: a.observation,
                                        substituteEmployeeId: a.substituteEmployee?.id
                                    });
                                }} 
                                    className={a.status=="T"?"w-full text-black bg-green-300 hover:bg-green-400  font-medium rounded-lg text-sm px-2 py-2.5 text-center":
                                        a.status=="NT"?"w-full text-black bg-red-300 hover:bg-red-400  font-medium rounded-lg text-sm px-2 py-2.5 text-center":
                                        a.status=="PE"?"w-full text-black bg-blue-300 hover:bg-blue-400  font-medium rounded-lg text-sm px-2 py-2.5 text-center":
                                        a.status=="PS"?"w-full text-black bg-purple-300 hover:bg-purple-400  font-medium rounded-lg text-sm px-2 py-2.5 text-center":
                                        a.status=="TS"?"w-full text-black bg-yellow-300 hover:bg-yellow-400  font-medium rounded-lg text-sm px-2 py-2.5 text-center":
                                        "w-full text-gray-200 bg-gray-100 hover:bg-gray-200  font-medium rounded-lg text-sm px-2 py-2.5 text-center"} type="button">{a.status}
                                </button>
                            </td>
                        )}
                        <td className="px-2 py-1 font-normal bg-lime-400 text-black whitespace-nowrap border border-gray-400 dark:text-white text-center">{item.countT}</td>
                        <td className="px-2 py-1 font-normal bg-red-300 text-black whitespace-nowrap border border-gray-400 dark:text-white text-center">{item.countNT}</td>

                    </tr>
                    )}


                    </tbody>
                    <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <td className="px-3 py-3 border border-gray-400 text-base " colSpan={daysOfMonth.length + 2}>TOTAL</td>
                    <td className="px-3 py-3 border border-gray-400 bg-lime-400 text-center">{Number(attendancesOfMonth.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.countT!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-red-300 text-center">{Number(attendancesOfMonth.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.countNT!), 0))}</td>
                    
                </tr>
                </tfoot>
                </table>
            </div>
        </>
    )
}

export default AttendanceList