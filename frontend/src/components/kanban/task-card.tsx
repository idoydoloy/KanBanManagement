import React from "react";
import { Calendar, User as UserIcon } from "lucide-react";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const getPriorityVariant = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "priorityHigh";
      case "medium":
        return "priorityMedium";
      case "low":
        return "priorityLow";
      default:
        return "outline";
    }
  };

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-palette-sage/60 hover:shadow-md">
      <div className="flex items-start justify-between gap-2 pb-2">
        <Badge variant={getPriorityVariant(task.priority)}>
          {task.priority}
        </Badge>
        {formattedDate && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-palette-brown transition-colors">
        {task.title}
      </h4>

      {task.description && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-palette-sage/20 text-[10px] font-bold text-palette-brown uppercase">
            {task.assignee_name ? task.assignee_name.charAt(0) : "U"}
          </div>
          <span className="truncate max-w-[130px] font-medium text-palette-brown">
            {task.assignee_name || "Unassigned"}
          </span>
        </div>

        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-heading">
          #{task.id.slice(-4)}
        </span>
      </div>
    </article>
  );
}
