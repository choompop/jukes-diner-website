import { Kanban, Plus, MoreVertical, Clock, User, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function NotionPipeline() {
  const columns = [
    { title: 'Backlog', color: 'bg-gray-100', items: [
      { id: 1, title: 'Summer Menu Photoshoot', tag: 'Marketing', user: 'John', date: 'Apr 15' },
      { id: 2, title: 'New Truck Wrap Design', tag: 'Design', user: 'Tyler', date: 'Apr 20' }
    ]},
    { title: 'In Progress', color: 'bg-diner-teal/10', items: [
      { id: 3, title: 'Franchise Training Manual', tag: 'Ops', user: 'Daniel', date: 'Apr 10' },
      { id: 4, title: 'Instagram Reels Campaign', tag: 'Social', user: 'Justin', date: 'Apr 8' }
    ]},
    { title: 'Review', color: 'bg-diner-red/10', items: [
      { id: 5, title: 'Q1 Revenue Report', tag: 'Finance', user: 'John', date: 'Apr 5' }
    ]},
    { title: 'Done', color: 'bg-green-50', items: [
      { id: 6, title: 'Website Launch', tag: 'Tech', user: 'Justin', date: 'Apr 4' }
    ]}
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">NOTION PIPELINE</h1>
          <p className="text-gray-500 font-serif italic">Franchise operations and content pipeline</p>
        </div>
        <button className="bg-diner-black text-white px-6 py-3 rounded-xl font-display text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> NEW TASK
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col h-full">
            <div className={cn(
              "p-4 rounded-t-2xl border-b-2 flex justify-between items-center",
              col.color,
              i === 0 ? "border-gray-200" : i === 1 ? "border-diner-teal" : i === 2 ? "border-diner-red" : "border-green-500"
            )}>
              <h3 className="font-display text-xs uppercase tracking-widest">{col.title}</h3>
              <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">{col.items.length}</span>
            </div>
            
            <div className="bg-white/50 border-x border-b border-gray-100 p-4 rounded-b-2xl flex-grow space-y-4">
              {col.items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-gray-50 text-gray-400 group-hover:bg-diner-cream group-hover:text-diner-red transition-colors">
                      {item.tag}
                    </span>
                    <button className="text-gray-300 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 leading-snug">{item.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-gray-500">{item.user}</span>
                      <div className="h-5 w-5 rounded-full bg-diner-chrome flex items-center justify-center text-[8px] font-display">
                        {item.user[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-gray-300 hover:border-gray-200 hover:text-gray-400 transition-all flex items-center justify-center gap-2 text-xs font-display">
                <Plus className="h-4 w-4" /> ADD TASK
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-12 text-center bg-white rounded-[2rem] border-4 border-dashed border-gray-100 mt-12">
        <Kanban className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h3 className="text-xl text-gray-400 mb-2">NOTION API INTEGRATION</h3>
        <p className="text-gray-400 font-serif italic max-w-md mx-auto">
          Connect your Notion database to sync your content pipeline and tasks in real-time.
        </p>
      </div>
    </div>
  );
}
