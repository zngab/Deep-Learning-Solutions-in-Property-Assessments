import { Draggable } from "react-beautiful-dnd";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const DragItem = styled.div`
  padding: 4px;
  margin: 0 0 8px 0;
  border-radius: 6px;
  max-height: 50px;
  background: #e1e1e1;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
`;

const ItemContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-family: Sans-serif;
  font-size: 0.9em;
`;

const ListItem = ({ item, index }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <DragItem
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ItemContent>{item.content}</ItemContent>
            {/* {item.content} */}
          </DragItem>
        );
      }}
    </Draggable>
  );
};

ListItem.defaultProps = {
  item: {},
  index: 0,
};

ListItem.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
};

export default ListItem;
