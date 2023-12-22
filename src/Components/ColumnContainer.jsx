import { SortableContext, useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import TaskItem from "./TaskItem";

const ColumnContainer = ({ column, deleteTask, updateTask, tasks }) => {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,

    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px]
max-h-[500px]
rounded-md
flex
flex-col
"
    >
      <div
        className="
    bg-mainBackgroundColor
    text-md
    h-[60px]
    rounded-md
    rounded-b-none
    p-3
    font-bold
    border-columnBackgroundColor
    border-4
    flex
    items-center
    justify-between
    "
      >
        <div className="flex gap-2">{column.title}</div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnContainer;
