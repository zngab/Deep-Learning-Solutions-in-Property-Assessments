import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 15px;
  background: #ffffff;
`;

const ColumnHeader = styled.div`
  text-transform: capitalize;
  margin-bottom: 20px;
  text-align: center;
  font-family: Sans-Serif;
  font-weight: 700;
`;

const DraggableElement = ({ prefix, elements }) => {
  return (
    <DroppableStyles>
      <ColumnHeader>{prefix}</ColumnHeader>
      <Droppable
        droppableId={`${prefix}`}
        // droppableId={prefix}
      >
        {(provided) => (
          <div
            className={`${prefix}`}
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              minHeight: "300",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridAutoFlow: "row",
              gridGap: "10px",
            }}
          >
            {elements.map((item, index) => (
              <ListItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DroppableStyles>
  );
};

DraggableElement.defaultProps = {
  prefix: "",
  elements: [{}],
};

DraggableElement.propTypes = {
  prefix: PropTypes.string,
  elements: PropTypes.arrayOf(PropTypes.object),
};
export default DraggableElement;
