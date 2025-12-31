import { cn } from "@/lib/utils";
import { User, Users, Crown, Briefcase, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Employee } from "@/types/game";

interface Department {
  id: string;
  name: string;
  head?: Employee;
  members: Employee[];
  color: string;
}

interface CompanyOrgChartProps {
  companyName: string;
  ceo: string;
  employees: Employee[];
}

export function CompanyOrgChart({ companyName, ceo, employees }: CompanyOrgChartProps) {
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['tech', 'sales']);

  // Group employees by department
  const departments: Department[] = [
    { 
      id: 'tech', 
      name: 'Technologie', 
      members: employees.filter(e => ['développeur', 'ingénieur', 'technicien'].some(t => e.role.toLowerCase().includes(t))),
      color: 'bg-blue-500/20 border-blue-500/30'
    },
    { 
      id: 'sales', 
      name: 'Commercial', 
      members: employees.filter(e => ['commercial', 'vente', 'account'].some(t => e.role.toLowerCase().includes(t))),
      color: 'bg-green-500/20 border-green-500/30'
    },
    { 
      id: 'marketing', 
      name: 'Marketing', 
      members: employees.filter(e => ['marketing', 'communication', 'brand'].some(t => e.role.toLowerCase().includes(t))),
      color: 'bg-pink-500/20 border-pink-500/30'
    },
    { 
      id: 'hr', 
      name: 'RH & Admin', 
      members: employees.filter(e => ['rh', 'admin', 'office', 'assistant'].some(t => e.role.toLowerCase().includes(t))),
      color: 'bg-purple-500/20 border-purple-500/30'
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      members: employees.filter(e => ['finance', 'comptable', 'analyst'].some(t => e.role.toLowerCase().includes(t))),
      color: 'bg-emerald-500/20 border-emerald-500/30'
    },
  ].filter(d => d.members.length > 0);

  // Employees not in any category
  const uncategorized = employees.filter(e => 
    !departments.some(d => d.members.includes(e))
  );

  if (uncategorized.length > 0) {
    departments.push({
      id: 'other',
      name: 'Autres',
      members: uncategorized,
      color: 'bg-gray-500/20 border-gray-500/30'
    });
  }

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* CEO */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-sm">{ceo}</span>
          <span className="text-xs text-muted-foreground">PDG</span>
        </div>
        <div className="w-0.5 h-6 bg-white/20" />
      </div>

      {/* Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map(dept => (
          <div key={dept.id} className={cn("rounded-xl border p-3", dept.color)}>
            <button
              onClick={() => toggleDept(dept.id)}
              className="flex items-center justify-between w-full mb-2"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium text-sm">{dept.name}</span>
                <span className="text-xs text-muted-foreground">({dept.members.length})</span>
              </div>
              {expandedDepts.includes(dept.id) 
                ? <ChevronDown className="w-4 h-4" />
                : <ChevronRight className="w-4 h-4" />
              }
            </button>

            {expandedDepts.includes(dept.id) && (
              <div className="space-y-1.5 mt-2 pt-2 border-t border-white/10">
                {dept.members.map(emp => (
                  <div 
                    key={emp.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium block truncate">{emp.name}</span>
                      <span className="text-[10px] text-muted-foreground truncate block">{emp.role}</span>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      emp.moral >= 70 ? "bg-success" : emp.moral >= 40 ? "bg-warning" : "bg-destructive"
                    )} title={`Moral: ${emp.moral}%`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucun employé pour le moment</p>
          <p className="text-xs">Recrutez votre première équipe !</p>
        </div>
      )}
    </div>
  );
}
