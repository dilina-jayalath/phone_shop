import React from 'react';
import StatusRound from './StatusRound';

function DeliveryDetails() {
  return (
    <div className="bg-background p-4 md:p-8 rounded-lg shadow-lg transition-all duration-300 space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-primary">ORDER STATUS</h2>
      <p className="text-2xl md:text-3xl font-extrabold text-accent">#42787</p>
      <p className="text-base md:text-lg text-muted-foreground dark:text-zinc-300">
        #UF5____2YP Status: 
        <span className="text-green-600 dark:text-green-400 font-semibold"> In Transit</span>
      </p>
      <p className="text-sm md:text-base text-muted-foreground dark:text-zinc-400">
        Your order is on its way to you!
      </p>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex w-full md:w-1/4 mt-[-10px]">
          <span className="ml-5 bg-black dark:bg-black-400 w-full h-1 opacity-50"></span>
        </div>
        <StatusRound completed={true} name="Order Placed" />
        <StatusRound completed={false} name="In Transit" />
        <StatusRound completed={false} name="Out for Delivery" />
        <StatusRound completed={false} name="Delivered" />
      </div>
      
      <div className="mt-4 md:mt-6">
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm md:text-base text-muted-foreground dark:text-zinc-400">
            Delivered → Delivered, In/At Mailbox 
            <span className="block text-xs md:text-sm text-muted-foreground dark:text-zinc-400">2020-11-14 10:35 UTC</span>
          </li>
          <li className="text-sm md:text-base text-muted-foreground dark:text-zinc-400">
            Out for Delivery → Out for Delivery 
            <span className="block text-xs md:text-sm text-muted-foreground dark:text-zinc-400">2020-11-14 04:28 UTC</span>
          </li>
          <li className="text-sm md:text-base text-muted-foreground dark:text-zinc-400">
            In Transit → Arrived at Post Office 
            <span className="block text-xs md:text-sm text-muted-foreground dark:text-zinc-400">2020-11-14 04:17 UTC</span>
          </li>
        </ul>
      </div>
      
      <button className="mt-4 md:mt-6 bg-slate-500 text-white hover:bg-secondary/80 p-2 md:p-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105">
        Refresh
      </button>
    </div>
  );
}

export default DeliveryDetails;
