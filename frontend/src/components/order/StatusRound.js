import React from 'react'
import { TiTickOutline } from 'react-icons/ti'

function StatusRound({completed , name}) {
  return (
    <div>
        <div className="flex-col flex items-center justify-center space-y-1">
            {completed ? ( 
            <>
                <span className="bg-green-500 dark:bg-green-400 rounded-full w-28 h-28 inline-block mr-2"><TiTickOutline size={100}/></span>   
                <span className="text-muted-foreground dark:text-pretty">{name}</span>
            </>
        )
            :(
            <>
                <span className="bg-red-500 dark:bg-red-300 rounded-full w-28 h-28 inline-block mr-2"></span>
                <span className="text-muted-foreground dark:text-slate-400">{name}</span>
                </>

            )}
           
        </div>
    </div>
  )
}

export default StatusRound