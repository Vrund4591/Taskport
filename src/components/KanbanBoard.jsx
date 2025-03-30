import { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-x: auto;
  box-sizing: border-box;
`;

const BoardContainer = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  padding: 10px 0;
  overflow-x: auto;
`;

const Column = styled.div`
  flex: 0 0 300px;
  margin: 0 10px;
  background-color: ${props => props.theme.secondaryBackground};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

const ColumnHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }

  .status-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${props => props.color};
  }

  .task-count {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.secondaryText};
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 0.8rem;
  }
`;

const TaskList = styled.div`
  padding: 10px;
  flex: 1;
  overflow-y: auto;
`;

const AddTaskButton = styled.button`
  margin: 10px;
  padding: 8px;
  background-color: transparent;
  border: 1px dashed ${props => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.secondaryText};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.hoverBackground};
    color: ${props => props.theme.text};
  }

  svg {
    margin-right: 5px;
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

function KanbanBoard({ tasks, statuses, users, updateTask, moveTask, addTask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    assignee: 'all',
    priority: 'all',
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    moveTask(draggableId, destination.droppableId);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.assignee !== 'all' && task.assignee !== filters.assignee) {
      return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const createNewTask = (statusId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: "New Task",
      description: "",
      status: statusId,
      assignee: "",
      priority: "medium",
      dueDate: null,
      isNew: true
    };
    
    setSelectedTask(newTask);
  };

  return (
    <BoardWrapper>
      <BoardHeader>
        <h2>Task Board</h2>
        <FilterContainer>
          <FilterSelect 
            value={filters.assignee}
            onChange={(e) => setFilters({...filters, assignee: e.target.value})}
          >
            <option value="all">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </FilterSelect>
        </FilterContainer>
      </BoardHeader>

      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardContainer>
          {statuses.map((status) => {
            const statusTasks = filteredTasks.filter(task => task.status === status.id);
            
            return (
              <Column key={status.id}>
                <ColumnHeader color={status.color}>
                  <h3>
                    <div className="status-color" style={{ backgroundColor: status.color }}></div>
                    {status.name}
                  </h3>
                  <div className="task-count">{statusTasks.length}</div>
                </ColumnHeader>
                <Droppable droppableId={status.id}>
                  {(provided) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {statusTasks.map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openTaskDetail(task)}
                            >
                              <TaskCard 
                                task={task} 
                                users={users}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
                <AddTaskButton onClick={() => createNewTask(status.id)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Task
                </AddTaskButton>
              </Column>
            );
          })}
        </BoardContainer>
      </DragDropContext>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          users={users}
          onClose={closeTaskDetail}
          onUpdate={(updatedTask) => {
            if (updatedTask.isNew) {
              delete updatedTask.isNew;
              addTask(updatedTask);
            } else {
              updateTask(updatedTask);
            }
            closeTaskDetail();
          }}
        />
      )}
    </BoardWrapper>
  );
}

export default KanbanBoard;
