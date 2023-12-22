import { useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
const defaultCols = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "inprogress",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const TaskBoard = () => {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      columnId: "todo",
      content: "Start the game ",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function createTask() {
    const newTask = {
      id: generateId(),
      columnId: "todo",
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
  }
  return (
    <div
      className="
      m-auto
      flex
      min-h-screen
      w-full
      items-center
      overflow-x-auto
      overflow-y-hidden
      px-[40px]
  "
    >
      <DndContext sensors={sensors} onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            {defaultCols.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ))}
          </div>
          <button
            onClick={() => {
              createTask();
            }}
            className="
    h-[60px]
    w-[150px]
    min-w-[150px]
    cursor-pointer
    rounded-lg
    bg-mainBackgroundColor
    border-2
    border-columnBackgroundColor
    p-4
    ring-rose-500
    hover:ring-2
    flex
    gap-2
    "
          >
            <PlusIcon />
            Add Task
          </button>
        </div>
      </DndContext>
    </div>
  );
};

export default TaskBoard;
